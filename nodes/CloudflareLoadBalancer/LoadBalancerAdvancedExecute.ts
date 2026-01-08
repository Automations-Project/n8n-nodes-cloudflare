import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

// Preview Execute Handler
export async function lbPreviewExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'get') {
		const previewId = this.getNodeParameter('previewId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/load_balancers/preview/${previewId}`,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

// Search Execute Handler
export async function lbSearchExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'search') {
		const searchQuery = this.getNodeParameter('searchQuery', index) as string;
		const searchType = this.getNodeParameter('searchType', index) as string;
		const qs: IDataObject = {};
		if (searchQuery) qs.query = searchQuery;
		if (searchType !== 'all') qs.type = searchType;

		const response = await cloudflareApiRequestAllItems.call(
			this,
			'GET',
			`/accounts/${accountId}/load_balancers/search`,
			{},
			qs,
		);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	return [];
}

// References Execute Handler
export async function lbReferencesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getPoolReferences') {
		const poolId = this.getNodeParameter('refPoolId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/load_balancers/pools/${poolId}/references`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'getMonitorReferences') {
		const monitorId = this.getNodeParameter('refMonitorId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/load_balancers/monitors/${monitorId}/references`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	return [];
}
