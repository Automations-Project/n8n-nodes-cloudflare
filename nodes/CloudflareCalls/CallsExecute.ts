import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function callsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	// App Resource
	if (resource === 'app') {
		if (operation === 'create') {
			const name = this.getNodeParameter('name', index) as string;
			const body = { name };
			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				`/accounts/${accountId}/calls/apps`,
				body,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'delete') {
			const appId = this.getNodeParameter('appId', index) as string;
			await cloudflareApiRequest.call(
				this,
				'DELETE',
				`/accounts/${accountId}/calls/apps/${appId}`,
			);
			return [{ json: { success: true, appId } }];
		}

		if (operation === 'update') {
			const appId = this.getNodeParameter('appId', index) as string;
			const name = this.getNodeParameter('name', index) as string;
			const body = { name };
			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/accounts/${accountId}/calls/apps/${appId}`,
				body,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					`/accounts/${accountId}/calls/apps`,
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					`/accounts/${accountId}/calls/apps`,
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}
	}

	// TURN Key Resource
	if (resource === 'turnKey') {
		if (operation === 'create') {
			const keyName = this.getNodeParameter('keyName', index) as string;
			const body: IDataObject = {};
			if (keyName) {
				body.name = keyName;
			}
			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				`/accounts/${accountId}/calls/turn_keys`,
				body,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'delete') {
			const keyId = this.getNodeParameter('keyId', index) as string;
			await cloudflareApiRequest.call(
				this,
				'DELETE',
				`/accounts/${accountId}/calls/turn_keys/${keyId}`,
			);
			return [{ json: { success: true, keyId } }];
		}

		if (operation === 'get') {
			const keyId = this.getNodeParameter('keyId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/calls/turn_keys/${keyId}`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'update') {
			const keyId = this.getNodeParameter('keyId', index) as string;
			const keyName = this.getNodeParameter('keyName', index) as string;
			const body: IDataObject = {};
			if (keyName) {
				body.name = keyName;
			}
			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/accounts/${accountId}/calls/turn_keys/${keyId}`,
				body,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					`/accounts/${accountId}/calls/turn_keys`,
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					`/accounts/${accountId}/calls/turn_keys`,
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}
	}

	return [];
}

