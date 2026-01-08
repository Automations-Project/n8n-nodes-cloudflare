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
	}

	if (resource === 'issue') {
		const basePath = `/accounts/${accountId}/security-center/issues`;

		if (operation === 'getMany') {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		}
		if (operation === 'dismiss') {
			const issueId = this.getNodeParameter('issueId', index) as string;
			const response = await cloudflareApiRequest.call(this, 'PUT', `${basePath}/${issueId}/dismiss`, {});
			return [{ json: response as IDataObject }];
		}
	}

	return [];
}
