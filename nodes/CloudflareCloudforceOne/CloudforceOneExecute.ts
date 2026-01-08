import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function cloudforceOneExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'listRequests') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/cloudforce-one/requests/priority`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getRequest') {
		const requestId = this.getNodeParameter('requestId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/cloudforce-one/requests/${requestId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createRequest') {
		const content = this.getNodeParameter('content', index) as string;
		const priority = this.getNodeParameter('priority', index) as string;
		const body = { content, priority };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/cloudforce-one/requests/new`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteRequest') {
		const requestId = this.getNodeParameter('requestId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/cloudforce-one/requests/${requestId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
