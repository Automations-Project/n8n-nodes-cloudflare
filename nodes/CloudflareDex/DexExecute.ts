import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function dexExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'listTests') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/dex/tests`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getTest') {
		const testId = this.getNodeParameter('testId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/dex/tests/${testId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createTest') {
		const name = this.getNodeParameter('name', index) as string;
		const testType = this.getNodeParameter('testType', index) as string;
		const targetUrl = this.getNodeParameter('targetUrl', index, '') as string;
		const enabled = this.getNodeParameter('enabled', index) as boolean;
		const body: IDataObject = { name, kind: testType, enabled };
		if (targetUrl) body.target = targetUrl;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/dex/tests`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateTest') {
		const testId = this.getNodeParameter('testId', index) as string;
		const targetUrl = this.getNodeParameter('targetUrl', index, '') as string;
		const enabled = this.getNodeParameter('enabled', index) as boolean;
		const body: IDataObject = { enabled };
		if (targetUrl) body.target = targetUrl;
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/dex/tests/${testId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteTest') {
		const testId = this.getNodeParameter('testId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/dex/tests/${testId}`);
		return [{ json: { success: true } }];
	}

	if (operation === 'getColos') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/dex/colos`);
		const result = Array.isArray(response) ? response : (response as IDataObject).result || [];
		return this.helpers.returnJsonArray(result as IDataObject[]);
	}

	return [];
}
