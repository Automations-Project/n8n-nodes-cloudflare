import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function customHostnamesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/zones/${zoneId}/custom_hostnames`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const hostnameId = this.getNodeParameter('hostnameId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/custom_hostnames/${hostnameId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const hostname = this.getNodeParameter('hostname', index) as string;
		const sslMethod = this.getNodeParameter('sslMethod', index) as string;
		const sslType = this.getNodeParameter('sslType', index) as string;
		const body = { hostname, ssl: { method: sslMethod, type: sslType } };
		const response = await cloudflareApiRequest.call(this, 'POST', `/zones/${zoneId}/custom_hostnames`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const hostnameId = this.getNodeParameter('hostnameId', index) as string;
		const sslMethod = this.getNodeParameter('sslMethod', index) as string;
		const body = { ssl: { method: sslMethod } };
		const response = await cloudflareApiRequest.call(this, 'PATCH', `/zones/${zoneId}/custom_hostnames/${hostnameId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const hostnameId = this.getNodeParameter('hostnameId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/zones/${zoneId}/custom_hostnames/${hostnameId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
