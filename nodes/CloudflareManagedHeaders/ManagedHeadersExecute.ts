import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function managedHeadersExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/managed_headers`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const headersConfig = JSON.parse(this.getNodeParameter('headersConfig', index) as string);
		const response = await cloudflareApiRequest.call(this, 'PATCH', `/zones/${zoneId}/managed_headers`, headersConfig);
		return [{ json: response as IDataObject }];
	}

	return [];
}
