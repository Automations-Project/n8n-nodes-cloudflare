import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function accountsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;

	// ===========================================
	//         Account Resource
	// ===========================================
	if (resource === 'account') {
		if (operation === 'get') {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					'/accounts',
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					'/accounts',
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}

		if (operation === 'update') {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.name) {
				body.name = updateFields.name;
			}

			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/accounts/${accountId}`,
				body,
			);
			return [{ json: response as IDataObject }];
		}
	}

	// ===========================================
	//         Member Resource
	// ===========================================
	if (resource === 'member') {
		const accountId = this.getNodeParameter('accountId', index) as string;

		if (operation === 'create') {
			const email = this.getNodeParameter('email', index) as string;
			const rolesStr = this.getNodeParameter('roles', index) as string;
			const status = this.getNodeParameter('status', index) as string;

			const roles = rolesStr.split(',').map((r) => r.trim()).filter((r) => r);

			const body = {
				email,
				roles,
				status,
			};

			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				`/accounts/${accountId}/members`,
				body,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'delete') {
			const memberId = this.getNodeParameter('memberId', index) as string;
			await cloudflareApiRequest.call(
				this,
				'DELETE',
				`/accounts/${accountId}/members/${memberId}`,
			);
			return [{ json: { success: true, memberId } }];
		}

		if (operation === 'get') {
			const memberId = this.getNodeParameter('memberId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/members/${memberId}`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					`/accounts/${accountId}/members`,
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					`/accounts/${accountId}/members`,
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}

		if (operation === 'update') {
			const memberId = this.getNodeParameter('memberId', index) as string;
			const rolesStr = this.getNodeParameter('updateRoles', index) as string;

			const roles = rolesStr.split(',').map((r) => r.trim()).filter((r) => r);

			const body = { roles };

			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/accounts/${accountId}/members/${memberId}`,
				body,
			);
			return [{ json: response as IDataObject }];
		}
	}

	// ===========================================
	//         Role Resource
	// ===========================================
	if (resource === 'role') {
		const accountId = this.getNodeParameter('accountId', index) as string;

		if (operation === 'get') {
			const roleId = this.getNodeParameter('roleId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/roles/${roleId}`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					`/accounts/${accountId}/roles`,
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					`/accounts/${accountId}/roles`,
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}
	}

	// ===========================================
	//         Subscription Resource
	// ===========================================
	if (resource === 'subscription') {
		const accountId = this.getNodeParameter('accountId', index) as string;

		if (operation === 'create') {
			const ratePlanId = this.getNodeParameter('ratePlanId', index) as string;
			const createOptions = this.getNodeParameter('createOptions', index) as IDataObject;

			const body: IDataObject = {
				rate_plan: { id: ratePlanId },
				...createOptions,
			};

			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				`/accounts/${accountId}/subscriptions`,
				body,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'delete') {
			const subscriptionId = this.getNodeParameter('subscriptionId', index) as string;
			await cloudflareApiRequest.call(
				this,
				'DELETE',
				`/accounts/${accountId}/subscriptions/${subscriptionId}`,
			);
			return [{ json: { success: true, subscriptionId } }];
		}

		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					`/accounts/${accountId}/subscriptions`,
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					`/accounts/${accountId}/subscriptions`,
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}

		if (operation === 'update') {
			const subscriptionId = this.getNodeParameter('subscriptionId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.rate_plan_id) {
				body.rate_plan = { id: updateFields.rate_plan_id };
			}
			if (updateFields.frequency) {
				body.frequency = updateFields.frequency;
			}

			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/accounts/${accountId}/subscriptions/${subscriptionId}`,
				body,
			);
			return [{ json: response as IDataObject }];
		}
	}

	return [];
}
