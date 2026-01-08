import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function secretsStoreExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'listStores') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/secrets_store/stores`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getStore') {
		const storeId = this.getNodeParameter('storeId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/secrets_store/stores/${storeId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createStore') {
		const storeName = this.getNodeParameter('storeName', index) as string;
		const body = { name: storeName };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/secrets_store/stores`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteStore') {
		const storeId = this.getNodeParameter('storeId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/secrets_store/stores/${storeId}`);
		return [{ json: { success: true } }];
	}

	if (operation === 'listSecrets') {
		const storeId = this.getNodeParameter('storeId', index) as string;
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/secrets_store/stores/${storeId}/secrets`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'createSecret') {
		const storeId = this.getNodeParameter('storeId', index) as string;
		const secretName = this.getNodeParameter('secretName', index) as string;
		const secretValue = this.getNodeParameter('secretValue', index) as string;
		const body = { name: secretName, value: secretValue };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/secrets_store/stores/${storeId}/secrets`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteSecret') {
		const storeId = this.getNodeParameter('storeId', index) as string;
		const secretName = this.getNodeParameter('secretName', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/secrets_store/stores/${storeId}/secrets/${secretName}`);
		return [{ json: { success: true } }];
	}

	return [];
}
