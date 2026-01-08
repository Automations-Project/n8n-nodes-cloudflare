import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function contentUploadScanExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getStatus') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/content-upload-scan/settings`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'enable') {
		const response = await cloudflareApiRequest.call(this, 'POST', `/zones/${zoneId}/content-upload-scan/enable`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'disable') {
		const response = await cloudflareApiRequest.call(this, 'POST', `/zones/${zoneId}/content-upload-scan/disable`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getPayloads') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/zones/${zoneId}/content-upload-scan/payloads`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	return [];
}
