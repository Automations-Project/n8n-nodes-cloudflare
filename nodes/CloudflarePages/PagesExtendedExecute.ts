import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

// Domain Execute Handler
export async function pagesDomainExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const projectName = this.getNodeParameter('domainProjectName', index) as string;
	const basePath = `/accounts/${accountId}/pages/projects/${projectName}/domains`;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}
	if (operation === 'get') {
		const domainName = this.getNodeParameter('domainName', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${domainName}`);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'create') {
		const domainName = this.getNodeParameter('domainName', index) as string;
		const response = await cloudflareApiRequest.call(this, 'POST', basePath, { name: domainName });
		return [{ json: response as IDataObject }];
	}
	if (operation === 'delete') {
		const domainName = this.getNodeParameter('domainName', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${domainName}`);
		return [{ json: { success: true } }];
	}

	return [];
}
