import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function brandProtectionExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'submit') {
		const url = this.getNodeParameter('url', index) as string;
		const body = { url };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/brand-protection/submit`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getUrlInfo') {
		const url = this.getNodeParameter('url', index) as string;
		const qs = { url };
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/brand-protection/url-info`, {}, qs);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'listQueries') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/brand-protection/queries`);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { per_page: limit };
			const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/brand-protection/queries`, {}, qs);
			const result = Array.isArray(response) ? response : (response as IDataObject).result;
			return this.helpers.returnJsonArray(result as IDataObject[]);
		}
	}

	if (operation === 'listMatches') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/brand-protection/matches`);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { per_page: limit };
			const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/brand-protection/matches`, {}, qs);
			const result = Array.isArray(response) ? response : (response as IDataObject).result;
			return this.helpers.returnJsonArray(result as IDataObject[]);
		}
	}

	return [];
}
