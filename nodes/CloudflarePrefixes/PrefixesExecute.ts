import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function prefixesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/addressing/prefixes`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const prefixId = this.getNodeParameter('prefixId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/addressing/prefixes/${prefixId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const cidr = this.getNodeParameter('cidr', index) as string;
		const asn = this.getNodeParameter('asn', index) as number;
		const description = this.getNodeParameter('description', index, '') as string;
		const body: IDataObject = { cidr, asn };
		if (description) body.description = description;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/addressing/prefixes`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const prefixId = this.getNodeParameter('prefixId', index) as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const body: IDataObject = {};
		if (description) body.description = description;
		const response = await cloudflareApiRequest.call(this, 'PATCH', `/accounts/${accountId}/addressing/prefixes/${prefixId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const prefixId = this.getNodeParameter('prefixId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/addressing/prefixes/${prefixId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
