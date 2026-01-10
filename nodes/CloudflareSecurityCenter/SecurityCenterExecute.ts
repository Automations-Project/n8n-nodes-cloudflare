import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function securityCenterExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (resource === 'insight') {
		const basePath = `/accounts/${accountId}/security-center/insights`;

		if (operation === 'getMany') {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		}
		if (operation === 'get') {
			const response = await cloudflareApiRequest.call(this, 'GET', basePath);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'dismiss') {
			// The dismiss endpoint is under insights, not issues
			const insightId = this.getNodeParameter('insightId', index) as string;
			const response = await cloudflareApiRequest.call(this, 'PUT', `${basePath}/${insightId}/dismiss`, {});
			return [{ json: response as IDataObject }];
		}
	}

	// NOTE: The "issues" resource was removed as it does not exist in the Cloudflare API.
	// The dismiss operation has been moved to the insights resource as per the API spec.

	return [];
}
