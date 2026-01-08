import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function pageShieldExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getSettings') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/page_shield`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateSettings') {
		const enabled = this.getNodeParameter('enabled', index) as boolean;
		const body = { enabled };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/page_shield`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'listScripts') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/zones/${zoneId}/page_shield/scripts`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getScript') {
		const scriptId = this.getNodeParameter('scriptId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/page_shield/scripts/${scriptId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'listConnections') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/zones/${zoneId}/page_shield/connections`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getConnection') {
		const connectionId = this.getNodeParameter('connectionId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/page_shield/connections/${connectionId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'listPolicies') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/zones/${zoneId}/page_shield/policies`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'createPolicy') {
		const action = this.getNodeParameter('action', index) as string;
		const expression = this.getNodeParameter('expression', index, '') as string;
		const body: IDataObject = { action };
		if (expression) body.expression = expression;
		const response = await cloudflareApiRequest.call(this, 'POST', `/zones/${zoneId}/page_shield/policies`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deletePolicy') {
		const policyId = this.getNodeParameter('policyId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/zones/${zoneId}/page_shield/policies/${policyId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
