import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

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

		if (operation === 'create') {
			const rule = JSON.parse(this.getNodeParameter('ruleDefinition', index) as string);
			const response = await cloudflareApiRequest.call(this, 'POST', `${basePath}/${rulesetId}/rules`, rule);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'delete') {
			const ruleId = this.getNodeParameter('ruleId', index) as string;
			await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${rulesetId}/rules/${ruleId}`);
			return [{ json: { success: true } }];
		}
		if (operation === 'update') {
			const ruleId = this.getNodeParameter('ruleId', index) as string;
			const rule = JSON.parse(this.getNodeParameter('ruleDefinition', index) as string);
			const response = await cloudflareApiRequest.call(this, 'PATCH', `${basePath}/${rulesetId}/rules/${ruleId}`, rule);
			return [{ json: response as IDataObject }];
		}
	}

	return [];
}
