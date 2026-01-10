import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

// AI Execute Handler
export async function radarAiExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'getSummary') {
		const dateRange = this.getNodeParameter('aiDateRange', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			'/radar/ai/bots/summary/user_agent',
			{},
			{ dateRange },
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

// Bots Execute Handler
export async function radarBotsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'getSummary') {
		const response = await cloudflareApiRequest.call(this, 'GET', '/radar/http/summary/bot_class');
		return [{ json: response as IDataObject }];
	}
	if (operation === 'getTop') {
		const limit = this.getNodeParameter('botsLimit', index) as number;
		const response = await cloudflareApiRequest.call(this, 'GET', '/radar/http/ases/bot_class', {}, { limit });
		return [{ json: response as IDataObject }];
	}

	return [];
}

// Netflows Execute Handler
export async function radarNetflowsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'getSummary') {
		const response = await cloudflareApiRequest.call(this, 'GET', '/radar/netflows/summary/protocol');
		return [{ json: response as IDataObject }];
	}
	if (operation === 'getTop') {
		const response = await cloudflareApiRequest.call(this, 'GET', '/radar/netflows/top/locations');
		return [{ json: response as IDataObject }];
	}

	return [];
}

// Email Execute Handler
export async function radarEmailExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'getSummary') {
		const response = await cloudflareApiRequest.call(this, 'GET', '/radar/email/security/summary/spam');
		return [{ json: response as IDataObject }];
	}
	if (operation === 'getMalicious') {
		const response = await cloudflareApiRequest.call(this, 'GET', '/radar/email/security/summary/malicious');
		return [{ json: response as IDataObject }];
	}
	if (operation === 'getSpam') {
		const response = await cloudflareApiRequest.call(this, 'GET', '/radar/email/security/summary/spam');
		return [{ json: response as IDataObject }];
	}

	return [];
}

// Datasets Execute Handler
export async function radarDatasetsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', '/radar/datasets');
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}
	if (operation === 'download') {
		const datasetAlias = this.getNodeParameter('datasetAlias', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/radar/datasets/${datasetAlias}`);
		return [{ json: response as IDataObject }];
	}

	return [];
}

// Search Execute Handler
export async function radarSearchExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'search') {
		const query = this.getNodeParameter('searchQuery', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', '/radar/search/global', {}, { query });
		return [{ json: response as IDataObject }];
	}

	return [];
}
