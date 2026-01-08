import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

// Identity Provider Execute Handler
export async function identityProviderExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const basePath = `/accounts/${accountId}/access/identity_providers`;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}
	if (operation === 'get') {
		const providerId = this.getNodeParameter('providerId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${providerId}`);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'create') {
		const providerName = this.getNodeParameter('providerName', index) as string;
		const providerType = this.getNodeParameter('providerType', index) as string;
		const body = { name: providerName, type: providerType, config: {} };
		const response = await cloudflareApiRequest.call(this, 'POST', basePath, body);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'update') {
		const providerId = this.getNodeParameter('providerId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'PUT', `${basePath}/${providerId}`, {});
		return [{ json: response as IDataObject }];
	}
	if (operation === 'delete') {
		const providerId = this.getNodeParameter('providerId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${providerId}`);
		return [{ json: { success: true } }];
	}

	return [];
}

// Access Group Execute Handler
export async function accessGroupExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const basePath = `/accounts/${accountId}/access/groups`;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}
	if (operation === 'get') {
		const groupId = this.getNodeParameter('groupId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${groupId}`);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'create') {
		const groupName = this.getNodeParameter('groupName', index) as string;
		const includeRules = JSON.parse(this.getNodeParameter('includeRules', index) as string);
		const body = { name: groupName, include: includeRules };
		const response = await cloudflareApiRequest.call(this, 'POST', basePath, body);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'update') {
		const groupId = this.getNodeParameter('groupId', index) as string;
		const includeRules = JSON.parse(this.getNodeParameter('includeRules', index) as string);
		const body = { include: includeRules };
		const response = await cloudflareApiRequest.call(this, 'PUT', `${basePath}/${groupId}`, body);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'delete') {
		const groupId = this.getNodeParameter('groupId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${groupId}`);
		return [{ json: { success: true } }];
	}

	return [];
}

// Service Token Execute Handler
export async function serviceTokenExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const basePath = `/accounts/${accountId}/access/service_tokens`;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}
	if (operation === 'create') {
		const tokenName = this.getNodeParameter('tokenName', index) as string;
		const tokenDuration = this.getNodeParameter('tokenDuration', index) as number;
		const body = { name: tokenName, duration: `${tokenDuration}y` };
		const response = await cloudflareApiRequest.call(this, 'POST', basePath, body);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'delete') {
		const tokenId = this.getNodeParameter('tokenId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${tokenId}`);
		return [{ json: { success: true } }];
	}
	if (operation === 'refresh') {
		const tokenId = this.getNodeParameter('tokenId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'POST', `${basePath}/${tokenId}/refresh`);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'rotate') {
		const tokenId = this.getNodeParameter('tokenId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'POST', `${basePath}/${tokenId}/rotate`);
		return [{ json: response as IDataObject }];
	}

	return [];
}
