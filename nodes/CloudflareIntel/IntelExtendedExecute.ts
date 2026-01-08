import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

// Sinkholes Execute Handler
export async function intelSinkholesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const accountId = this.getNodeParameter('accountId', index) as string;
	const response = await cloudflareApiRequestAllItems.call(
		this,
		'GET',
		`/accounts/${accountId}/intel/sinkholes`,
	);
	return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
}

// Indicator Feed Execute Handler
export async function intelIndicatorFeedExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const basePath = `/accounts/${accountId}/intel/indicator-feeds`;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}
	if (operation === 'get') {
		const feedId = this.getNodeParameter('feedId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${feedId}`);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'create') {
		const feedName = this.getNodeParameter('feedName', index) as string;
		const response = await cloudflareApiRequest.call(this, 'POST', basePath, { name: feedName });
		return [{ json: response as IDataObject }];
	}
	if (operation === 'update') {
		const feedId = this.getNodeParameter('feedId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'PUT', `${basePath}/${feedId}`, {});
		return [{ json: response as IDataObject }];
	}
	if (operation === 'delete') {
		const feedId = this.getNodeParameter('feedId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${feedId}`);
		return [{ json: { success: true } }];
	}

	return [];
}

// Miscategorization Execute Handler
export async function intelMiscategorizationExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const accountId = this.getNodeParameter('accountId', index) as string;
	const url = this.getNodeParameter('miscatUrl', index) as string;
	const category = this.getNodeParameter('miscatCategory', index) as string;

	const body: IDataObject = { url };
	if (category) body.content_adds = [category];

	const response = await cloudflareApiRequest.call(
		this,
		'POST',
		`/accounts/${accountId}/intel/miscategorization`,
		body,
	);
	return [{ json: response as IDataObject }];
}
