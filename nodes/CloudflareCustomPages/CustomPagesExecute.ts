import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function customPagesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/zones/${zoneId}/custom_pages`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const pageId = this.getNodeParameter('pageId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/custom_pages/${pageId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const pageId = this.getNodeParameter('pageId', index) as string;
		const url = this.getNodeParameter('url', index, '') as string;
		const state = this.getNodeParameter('state', index) as string;
		const body: IDataObject = { state };
		if (url) body.url = url;
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/custom_pages/${pageId}`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
