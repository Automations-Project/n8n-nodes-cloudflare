import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function teamnetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'listRoutes') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/teamnet/routes`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getRoute') {
		const routeId = this.getNodeParameter('routeId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/teamnet/routes/${routeId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createRoute') {
		const network = this.getNodeParameter('network', index) as string;
		const tunnelId = this.getNodeParameter('tunnelId', index) as string;
		const comment = this.getNodeParameter('comment', index, '') as string;
		const body: IDataObject = { network, tunnel_id: tunnelId };
		if (comment) body.comment = comment;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/teamnet/routes`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateRoute') {
		const routeId = this.getNodeParameter('routeId', index) as string;
		const comment = this.getNodeParameter('comment', index, '') as string;
		const body: IDataObject = {};
		if (comment) body.comment = comment;
		const response = await cloudflareApiRequest.call(this, 'PATCH', `/accounts/${accountId}/teamnet/routes/${routeId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteRoute') {
		const routeId = this.getNodeParameter('routeId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/teamnet/routes/${routeId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
