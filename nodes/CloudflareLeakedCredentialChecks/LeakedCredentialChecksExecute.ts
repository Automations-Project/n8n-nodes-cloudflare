import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function leakedCredentialChecksExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getStatus') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/leaked-credential-checks`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'enable') {
		const body = { enabled: true };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/leaked-credential-checks`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'disable') {
		const body = { enabled: false };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/leaked-credential-checks`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'listDetections') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/zones/${zoneId}/leaked-credential-checks/detections`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	return [];
}
