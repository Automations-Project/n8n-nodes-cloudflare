import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function addressMapsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/addressing/address_maps`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const addressMapId = this.getNodeParameter('addressMapId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/addressing/address_maps/${addressMapId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const description = this.getNodeParameter('description', index, '') as string;
		const enabled = this.getNodeParameter('enabled', index) as boolean;
		const body: IDataObject = { enabled };
		if (description) body.description = description;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/addressing/address_maps`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const addressMapId = this.getNodeParameter('addressMapId', index) as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const enabled = this.getNodeParameter('enabled', index) as boolean;
		const body: IDataObject = { enabled };
		if (description) body.description = description;
		const response = await cloudflareApiRequest.call(this, 'PATCH', `/accounts/${accountId}/addressing/address_maps/${addressMapId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const addressMapId = this.getNodeParameter('addressMapId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/addressing/address_maps/${addressMapId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
