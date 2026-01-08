import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function listsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/rules/lists`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const listId = this.getNodeParameter('listId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/rules/lists/${listId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const kind = this.getNodeParameter('kind', index) as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const body: IDataObject = { name, kind };
		if (description) body.description = description;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/rules/lists`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const listId = this.getNodeParameter('listId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/rules/lists/${listId}`);
		return [{ json: { success: true } }];
	}

	if (operation === 'update') {
		const listId = this.getNodeParameter('listId', index) as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const body: IDataObject = {};
		if (description) body.description = description;
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/rules/lists/${listId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getItems') {
		const listId = this.getNodeParameter('listId', index) as string;
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/rules/lists/${listId}/items`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'createItems') {
		const listId = this.getNodeParameter('listId', index) as string;
		const items = JSON.parse(this.getNodeParameter('items', index) as string);
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/rules/lists/${listId}/items`, items);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteItems') {
		const listId = this.getNodeParameter('listId', index) as string;
		const items = JSON.parse(this.getNodeParameter('items', index) as string);
		const body = { items };
		const response = await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/rules/lists/${listId}/items`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
