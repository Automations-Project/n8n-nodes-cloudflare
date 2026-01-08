import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function zoneSettingsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/zones/${zoneId}/settings`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const settingId = this.getNodeParameter('settingId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/settings/${settingId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const settingId = this.getNodeParameter('settingId', index) as string;
		const value = this.getNodeParameter('value', index) as string;
		const body = { value };
		const response = await cloudflareApiRequest.call(this, 'PATCH', `/zones/${zoneId}/settings/${settingId}`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
