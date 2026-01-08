import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function tunnelsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/cfd_tunnel`);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const qs = { per_page: limit };
			const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/cfd_tunnel`, {}, qs);
			const result = Array.isArray(response) ? response : (response as IDataObject).result;
			return this.helpers.returnJsonArray(result as IDataObject[]);
		}
	}

	if (operation === 'get') {
		const tunnelId = this.getNodeParameter('tunnelId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/cfd_tunnel/${tunnelId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const tunnelSecret = this.getNodeParameter('tunnelSecret', index, '') as string;
		const body: IDataObject = { name, config_src: 'cloudflare' };
		if (tunnelSecret) body.tunnel_secret = tunnelSecret;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/cfd_tunnel`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const tunnelId = this.getNodeParameter('tunnelId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/cfd_tunnel/${tunnelId}`);
		return [{ json: { success: true } }];
	}

	if (operation === 'getConfig') {
		const tunnelId = this.getNodeParameter('tunnelId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/cfd_tunnel/${tunnelId}/configurations`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateConfig') {
		const tunnelId = this.getNodeParameter('tunnelId', index) as string;
		const configJson = this.getNodeParameter('configJson', index) as string;
		const body = JSON.parse(configJson);
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/cfd_tunnel/${tunnelId}/configurations`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getToken') {
		const tunnelId = this.getNodeParameter('tunnelId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/cfd_tunnel/${tunnelId}/token`);
		return [{ json: response as IDataObject }];
	}

	return [];
}
