import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function warpConnectorExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/warp_connector`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const tunnelId = this.getNodeParameter('tunnelId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/warp_connector/${tunnelId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const body = { name };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/warp_connector`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const tunnelId = this.getNodeParameter('tunnelId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/warp_connector/${tunnelId}`);
		return [{ json: { success: true } }];
	}

	if (operation === 'getToken') {
		const tunnelId = this.getNodeParameter('tunnelId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/warp_connector/${tunnelId}/token`);
		return [{ json: response as IDataObject }];
	}

	return [];
}
