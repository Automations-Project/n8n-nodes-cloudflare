import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function sharesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/shares`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const shareId = this.getNodeParameter('shareId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/shares/${shareId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const resources = JSON.parse(this.getNodeParameter('resources', index) as string);
		const body = { name, resources };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/shares`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const shareId = this.getNodeParameter('shareId', index) as string;
		const resources = JSON.parse(this.getNodeParameter('resources', index) as string);
		const body = { resources };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/shares/${shareId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const shareId = this.getNodeParameter('shareId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/shares/${shareId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
