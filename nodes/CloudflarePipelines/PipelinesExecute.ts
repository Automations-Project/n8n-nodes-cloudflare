import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function pipelinesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/pipelines`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const pipelineName = this.getNodeParameter('pipelineName', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/pipelines/${pipelineName}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const config = JSON.parse(this.getNodeParameter('config', index) as string);
		const body = { name, ...config };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/pipelines`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const pipelineName = this.getNodeParameter('pipelineName', index) as string;
		const config = JSON.parse(this.getNodeParameter('config', index) as string);
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/pipelines/${pipelineName}`, config);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const pipelineName = this.getNodeParameter('pipelineName', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/pipelines/${pipelineName}`);
		return [{ json: { success: true } }];
	}

	return [];
}
