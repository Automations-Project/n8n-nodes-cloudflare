import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

/**
 * Build a Cloudflare rule object from GUI inputs
 */
function buildRuleFromGui(this: IExecuteFunctions, index: number): IDataObject {
	const description = this.getNodeParameter('ruleDescription', index, '') as string;
	const expression = this.getNodeParameter('ruleExpression', index) as string;
	const action = this.getNodeParameter('ruleAction', index) as string;
	const enabled = this.getNodeParameter('ruleEnabled', index, true) as boolean;

	const rule: IDataObject = {
		expression,
		action,
		enabled,
	};

	if (description) {
		rule.description = description;
	}

	// Build action_parameters based on action type
	switch (action) {
		case 'redirect': {
			const redirectType = this.getNodeParameter('redirectType', index) as string;
			const statusCode = this.getNodeParameter('redirectStatusCode', index, 301) as number;
			const preserveQuery = this.getNodeParameter('redirectPreserveQuery', index, false) as boolean;

			const targetUrl: IDataObject = {};
			if (redirectType === 'static') {
				targetUrl.value = this.getNodeParameter('redirectTargetUrl', index) as string;
			} else {
				targetUrl.expression = this.getNodeParameter('redirectTargetExpression', index) as string;
			}

			rule.action_parameters = {
				from_value: {
					target_url: targetUrl,
					status_code: statusCode,
					preserve_query_string: preserveQuery,
				},
			};
			break;
		}
		case 'rewrite': {
			const rewriteType = this.getNodeParameter('rewriteType', index) as string;
			const isDynamic = this.getNodeParameter('rewriteIsDynamic', index, false) as boolean;

			const rewriteValue: IDataObject = {};
			if (isDynamic) {
				rewriteValue.expression = this.getNodeParameter('rewriteExpression', index) as string;
			} else {
				rewriteValue.value = this.getNodeParameter('rewriteValue', index) as string;
			}

			if (rewriteType === 'uri_path') {
				rule.action_parameters = {
					uri: {
						path: rewriteValue,
					},
				};
			} else {
				rule.action_parameters = {
					uri: {
						query: rewriteValue,
					},
				};
			}
			break;
		}
		case 'route': {
			const hostname = this.getNodeParameter('routeHostname', index, '') as string;
			if (hostname) {
				rule.action_parameters = {
					origin: {
						host: hostname,
					},
				};
			}
			break;
		}
		// For actions like block, js_challenge, managed_challenge, log - no action_parameters needed
		case 'block':
		case 'js_challenge':
		case 'managed_challenge':
		case 'log':
			// These actions don't require action_parameters
			break;
		case 'skip':
			// Skip action would need phases/products to skip - for now leave empty
			// Users can use JSON mode for complex skip configurations
			break;
		case 'set_config':
			// set_config needs specific settings - users should use JSON mode
			break;
	}

	return rule;
}


export async function rulesetsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const scope = this.getNodeParameter('scope', index) as string;

	// Build base path based on scope
	let basePath: string;
	if (scope === 'account') {
		const accountId = this.getNodeParameter('accountId', index) as string;
		basePath = `/accounts/${accountId}/rulesets`;
	} else {
		const zoneId = this.getNodeParameter('zoneId', index) as string;
		basePath = `/zones/${zoneId}/rulesets`;
	}

	// ===========================================
	//         Ruleset Resource
	// ===========================================
	if (resource === 'ruleset') {
		if (operation === 'create') {
			const name = this.getNodeParameter('name', index) as string;
			const kind = this.getNodeParameter('kind', index) as string;
			const phase = this.getNodeParameter('phase', index) as string;
			const rulesJson = this.getNodeParameter('rules', index) as string;

			const rules = rulesJson ? JSON.parse(rulesJson) : [];

			const body = {
				name,
				kind,
				phase,
				rules,
			};

			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				basePath,
				body,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'delete') {
			const rulesetId = this.getNodeParameter('rulesetId', index) as string;
			await cloudflareApiRequest.call(
				this,
				'DELETE',
				`${basePath}/${rulesetId}`,
			);
			return [{ json: { success: true, rulesetId } }];
		}

		if (operation === 'get') {
			const rulesetId = this.getNodeParameter('rulesetId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`${basePath}/${rulesetId}`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					basePath,
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					basePath,
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}

		if (operation === 'update') {
			const rulesetId = this.getNodeParameter('rulesetId', index) as string;
			const rulesJson = this.getNodeParameter('rules', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			const body: IDataObject = {};

			if (rulesJson) {
				body.rules = JSON.parse(rulesJson);
			}
			if (updateFields.name) body.name = updateFields.name;
			if (updateFields.description) body.description = updateFields.description;

			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`${basePath}/${rulesetId}`,
				body,
			);
			return [{ json: response as IDataObject }];
		}
	}

	// Phase Resource
	if (resource === 'phase') {
		const scope = this.getNodeParameter('scope', index) as string;
		let basePath: string;
		if (scope === 'account') {
			const accountId = this.getNodeParameter('accountId', index) as string;
			basePath = `/accounts/${accountId}/rulesets`;
		} else {
			const zoneId = this.getNodeParameter('zoneId', index) as string;
			basePath = `/zones/${zoneId}/rulesets`;
		}
		const phaseName = this.getNodeParameter('phaseName', index) as string;

		if (operation === 'getEntrypoint') {
			const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/phases/${phaseName}/entrypoint`);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'updateEntrypoint') {
			const rules = JSON.parse(this.getNodeParameter('phaseRules', index) as string);
			const response = await cloudflareApiRequest.call(this, 'PUT', `${basePath}/phases/${phaseName}/entrypoint`, { rules });
			return [{ json: response as IDataObject }];
		}
		if (operation === 'listVersions') {
			const rulesetId = this.getNodeParameter('phaseRulesetId', index) as string;
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', `${basePath}/${rulesetId}/versions`);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
		if (operation === 'getVersion') {
			const rulesetId = this.getNodeParameter('phaseRulesetId', index) as string;
			const version = this.getNodeParameter('version', index) as string;
			const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${rulesetId}/versions/${version}`);
			return [{ json: response as IDataObject }];
		}
	}

	// Rule Resource
	if (resource === 'rule') {
		const scope = this.getNodeParameter('scope', index) as string;
		let basePath: string;
		if (scope === 'account') {
			const accountId = this.getNodeParameter('accountId', index) as string;
			basePath = `/accounts/${accountId}/rulesets`;
		} else {
			const zoneId = this.getNodeParameter('zoneId', index) as string;
			basePath = `/zones/${zoneId}/rulesets`;
		}
		const rulesetId = this.getNodeParameter('ruleRulesetId', index) as string;

		if (operation === 'create' || operation === 'update') {
			const inputMode = this.getNodeParameter('ruleInputMode', index, 'json') as string;
			let rule: IDataObject;

			if (inputMode === 'gui') {
				// Build rule from GUI inputs
				rule = buildRuleFromGui.call(this, index);
			} else {
				// Use raw JSON
				rule = JSON.parse(this.getNodeParameter('ruleDefinition', index) as string);
			}

			if (operation === 'create') {
				const response = await cloudflareApiRequest.call(this, 'POST', `${basePath}/${rulesetId}/rules`, rule);
				return [{ json: response as IDataObject }];
			} else {
				const ruleId = this.getNodeParameter('ruleId', index) as string;
				const response = await cloudflareApiRequest.call(this, 'PATCH', `${basePath}/${rulesetId}/rules/${ruleId}`, rule);
				return [{ json: response as IDataObject }];
			}
		}
		if (operation === 'delete') {
			const ruleId = this.getNodeParameter('ruleId', index) as string;
			await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${rulesetId}/rules/${ruleId}`);
			return [{ json: { success: true } }];
		}
	}

	return [];
}
