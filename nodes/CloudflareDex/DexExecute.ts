import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function dexExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'listTests') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/dex/tests/overview`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}


	// NOTE: Individual test CRUD operations (get, create, update, delete) are not
	// available in the public Cloudflare API. Only listTests (overview) is supported.

	if (operation === 'getColos') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/dex/colos`);
		const result = Array.isArray(response) ? response : (response as IDataObject).result || [];
		return this.helpers.returnJsonArray(result as IDataObject[]);
	}

	return [];
}
