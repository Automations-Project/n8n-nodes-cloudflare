import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function emailRoutingExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;

	if (resource === 'rule') {
		const zoneId = this.getNodeParameter('zoneId', index) as string;

		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					`/zones/${zoneId}/email/routing/rules`,
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					`/zones/${zoneId}/email/routing/rules`,
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}

		if (operation === 'create') {
			const name = this.getNodeParameter('name', index) as string;
			const enabled = this.getNodeParameter('enabled', index) as boolean;
			const matchers = (this.getNodeParameter('matchers', index) as IDataObject)
				.matcher as IDataObject[];
			const actions = (this.getNodeParameter('actions', index) as IDataObject)
				.action as IDataObject[];

			const body = {
				name,
				enabled,
				matchers: matchers?.map((m) => ({
					type: m.type,
					field: m.field,
					value: m.value,
				})),
				actions: actions?.map((a) => ({
					type: a.type,
					value: a.value ? [a.value] : [], // actions.value is array for some reason? docs: "value": ["destination@example.com"]
				})),
			};

			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				`/zones/${zoneId}/email/routing/rules`,
				body,
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}

		if (operation === 'update') {
			const ruleId = this.getNodeParameter('ruleId', index) as string;
			const name = this.getNodeParameter('name', index) as string;
			const enabled = this.getNodeParameter('enabled', index) as boolean;
			const matchers = (this.getNodeParameter('matchers', index) as IDataObject)
				?.matcher as IDataObject[];
			const actions = (this.getNodeParameter('actions', index) as IDataObject)
				?.action as IDataObject[];

			const body: IDataObject = {
				name,
				enabled,
			};

			if (matchers) {
				body.matchers = matchers.map((m) => ({
					type: m.type,
					field: m.field,
					value: m.value,
				}));
			}

			if (actions) {
				body.actions = actions.map((a) => ({
					type: a.type,
					value: a.value ? [a.value] : [],
				}));
			}

			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/zones/${zoneId}/email/routing/rules/${ruleId}`,
				body,
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}

		if (operation === 'delete') {
			const ruleId = this.getNodeParameter('ruleId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'DELETE',
				`/zones/${zoneId}/email/routing/rules/${ruleId}`,
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}

		if (operation === 'get') {
			const ruleId = this.getNodeParameter('ruleId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/email/routing/rules/${ruleId}`,
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}
	}

	if (resource === 'address') {
		const accountId = this.getNodeParameter('accountId', index) as string;

		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					`/accounts/${accountId}/email/routing/addresses`,
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					`/accounts/${accountId}/email/routing/addresses`,
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}

		if (operation === 'create') {
			const email = this.getNodeParameter('email', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				`/accounts/${accountId}/email/routing/addresses`,
				{ email },
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}

		if (operation === 'delete') {
			const addressId = this.getNodeParameter('addressId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'DELETE',
				`/accounts/${accountId}/email/routing/addresses/${addressId}`,
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}

		if (operation === 'get') {
			const addressId = this.getNodeParameter('addressId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/email/routing/addresses/${addressId}`,
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}
	}

	// Settings Resource
	if (resource === 'settings') {
		const zoneId = this.getNodeParameter('zoneId', index) as string;

		if (operation === 'get') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/email/routing`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'enable') {
			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				`/zones/${zoneId}/email/routing/enable`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'disable') {
			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				`/zones/${zoneId}/email/routing/disable`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'getCatchAll') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/email/routing/rules/catch_all`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'updateCatchAll') {
			const enabled = this.getNodeParameter('catchAllEnabled', index) as boolean;
			const actionType = this.getNodeParameter('catchAllActionType', index) as string;

			const body: IDataObject = {
				enabled,
				matchers: [{ type: 'all' }],
				actions: [{ type: actionType }],
			};

			if (actionType === 'forward') {
				const forwardTo = this.getNodeParameter('catchAllForwardTo', index) as string;
				if (forwardTo) {
					body.actions = [{ type: 'forward', value: [forwardTo] }];
				}
			}

			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/zones/${zoneId}/email/routing/rules/catch_all`,
				body,
			);
			return [{ json: response as IDataObject }];
		}
	}

	// ============= Email Routing DNS =============
	if (resource === 'emailRoutingDns') {
		const zoneId = this.getNodeParameter('zoneId', index) as string;

		if (operation === 'get') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/email/routing/dns`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	// ============= Catch-All Rule =============
	if (resource === 'catchAll') {
		const zoneId = this.getNodeParameter('zoneId', index) as string;

		if (operation === 'get') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/email/routing/rules/catch_all`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'update') {
			const enabled = this.getNodeParameter('enabled', index) as boolean;
			const actionsJson = this.getNodeParameter('actionsJson', index) as string;
			const matchersJson = this.getNodeParameter('matchersJson', index) as string;

			const body = {
				enabled,
				actions: JSON.parse(actionsJson),
				matchers: JSON.parse(matchersJson),
			};

			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/zones/${zoneId}/email/routing/rules/catch_all`,
				body,
			);
			return [{ json: response as IDataObject }];
		}
	}

	return [];
}

