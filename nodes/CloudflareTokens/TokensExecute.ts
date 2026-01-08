import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function tokensExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', '/user/tokens');
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const tokenId = this.getNodeParameter('tokenId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/user/tokens/${tokenId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'verify') {
		const response = await cloudflareApiRequest.call(this, 'GET', '/user/tokens/verify');
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const tokenName = this.getNodeParameter('tokenName', index) as string;
		const policies = JSON.parse(this.getNodeParameter('policies', index) as string);
		const body = { name: tokenName, policies };
		const response = await cloudflareApiRequest.call(this, 'POST', '/user/tokens', body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const tokenId = this.getNodeParameter('tokenId', index) as string;
		const policies = JSON.parse(this.getNodeParameter('policies', index) as string);
		const body = { policies };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/user/tokens/${tokenId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const tokenId = this.getNodeParameter('tokenId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/user/tokens/${tokenId}`);
		return [{ json: { success: true } }];
	}

	return [];
}

export async function accountTokensExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/tokens`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const tokenId = this.getNodeParameter('acctTokenId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/tokens/${tokenId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const tokenName = this.getNodeParameter('acctTokenName', index) as string;
		const policies = JSON.parse(this.getNodeParameter('acctPolicies', index) as string);
		const body = { name: tokenName, policies };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/tokens`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const tokenId = this.getNodeParameter('acctTokenId', index) as string;
		const policies = JSON.parse(this.getNodeParameter('acctPolicies', index) as string);
		const body = { policies };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/tokens/${tokenId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const tokenId = this.getNodeParameter('acctTokenId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/tokens/${tokenId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
