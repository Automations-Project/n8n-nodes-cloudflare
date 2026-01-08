import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function hostnameSettingsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;
	const settingId = this.getNodeParameter('settingId', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/hostnames/settings/${settingId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const hostname = this.getNodeParameter('hostname', index) as string;
		const value = this.getNodeParameter('value', index) as string;
		const body = { value };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/hostnames/settings/${settingId}/${hostname}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const hostname = this.getNodeParameter('hostname', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/zones/${zoneId}/hostnames/settings/${settingId}/${hostname}`);
		return [{ json: { success: true } }];
	}

	return [];
}
