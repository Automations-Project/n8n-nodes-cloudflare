import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function workersForPlatformsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (resource === 'namespace') {
		const basePath = `/accounts/${accountId}/workers/dispatch/namespaces`;

		if (operation === 'getMany') {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		}
		if (operation === 'get') {
			const namespaceName = this.getNodeParameter('namespaceName', index) as string;
			const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${namespaceName}`);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'create') {
			const namespaceName = this.getNodeParameter('namespaceName', index) as string;
			const response = await cloudflareApiRequest.call(this, 'POST', basePath, { name: namespaceName });
			return [{ json: response as IDataObject }];
		}
		if (operation === 'delete') {
			const namespaceName = this.getNodeParameter('namespaceName', index) as string;
			await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${namespaceName}`);
			return [{ json: { success: true } }];
		}
	}

	if (resource === 'script') {
		const dispatchNamespace = this.getNodeParameter('dispatchNamespace', index) as string;
		const basePath = `/accounts/${accountId}/workers/dispatch/namespaces/${dispatchNamespace}/scripts`;

		if (operation === 'getMany') {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		}
		if (operation === 'get') {
			const scriptName = this.getNodeParameter('scriptName', index) as string;
			const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${scriptName}`);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'delete') {
			const scriptName = this.getNodeParameter('scriptName', index) as string;
			await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${scriptName}`);
			return [{ json: { success: true } }];
		}
		if (operation === 'upload') {
			const scriptName = this.getNodeParameter('scriptName', index) as string;
			const response = await cloudflareApiRequest.call(this, 'PUT', `${basePath}/${scriptName}`, {});
			return [{ json: response as IDataObject }];
		}
	}

	return [];
}
