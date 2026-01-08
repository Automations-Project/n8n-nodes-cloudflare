import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

// Route Execute Handler
export async function workersRouteExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;
	const basePath = `/zones/${zoneId}/workers/routes`;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}
	if (operation === 'get') {
		const routeId = this.getNodeParameter('routeId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${routeId}`);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'create') {
		const pattern = this.getNodeParameter('routePattern', index) as string;
		const script = this.getNodeParameter('routeScript', index) as string;
		const body = { pattern, script };
		const response = await cloudflareApiRequest.call(this, 'POST', basePath, body);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'update') {
		const routeId = this.getNodeParameter('routeId', index) as string;
		const pattern = this.getNodeParameter('routePattern', index) as string;
		const script = this.getNodeParameter('routeScript', index) as string;
		const body = { pattern, script };
		const response = await cloudflareApiRequest.call(this, 'PUT', `${basePath}/${routeId}`, body);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'delete') {
		const routeId = this.getNodeParameter('routeId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${routeId}`);
		return [{ json: { success: true } }];
	}

	return [];
}

// Secret Execute Handler
export async function workersSecretExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const scriptName = this.getNodeParameter('secretScriptName', index) as string;
	const basePath = `/accounts/${accountId}/workers/scripts/${scriptName}/secrets`;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}
	if (operation === 'create') {
		const secretName = this.getNodeParameter('secretName', index) as string;
		const secretValue = this.getNodeParameter('secretValue', index) as string;
		const body = { name: secretName, text: secretValue, type: 'secret_text' };
		const response = await cloudflareApiRequest.call(this, 'PUT', basePath, body);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'delete') {
		const secretName = this.getNodeParameter('secretName', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${secretName}`);
		return [{ json: { success: true } }];
	}

	return [];
}

// Version Execute Handler
export async function workersVersionExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const scriptName = this.getNodeParameter('versionScriptName', index) as string;
	const basePath = `/accounts/${accountId}/workers/scripts/${scriptName}/versions`;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}
	if (operation === 'get') {
		const versionId = this.getNodeParameter('versionId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${versionId}`);
		return [{ json: response as IDataObject }];
	}

	return [];
}

// Deployment Execute Handler
export async function workersDeploymentExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const scriptName = this.getNodeParameter('deploymentScriptName', index) as string;
	const basePath = `/accounts/${accountId}/workers/scripts/${scriptName}/deployments`;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}
	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(this, 'GET', basePath);
		return [{ json: response as IDataObject }];
	}

	return [];
}
