import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function devicesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/devices`);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { per_page: limit };
			const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/devices`, {}, qs);
			const result = Array.isArray(response) ? response : (response as IDataObject).result;
			return this.helpers.returnJsonArray(result as IDataObject[]);
		}
	}

	if (operation === 'get') {
		const deviceId = this.getNodeParameter('deviceId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/devices/${deviceId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'revoke') {
		const deviceId = this.getNodeParameter('deviceId', index) as string;
		await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/devices/${deviceId}/revoke`);
		return [{ json: { success: true } }];
	}

	if (operation === 'getSettings') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/devices/settings`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateSettings') {
		const disableAutoFallback = this.getNodeParameter('disableAutoFallback', index) as boolean;
		const body = { disable_for_time: disableAutoFallback ? 86400 : 0 };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/devices/settings`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getPolicies') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/devices/policies`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	return [];
}
