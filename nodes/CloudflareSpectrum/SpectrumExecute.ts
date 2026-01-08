import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function spectrumExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const protocol = this.getNodeParameter('protocol', index) as string;
		const dnsName = this.getNodeParameter('dnsName', index) as string;
		const originDns = this.getNodeParameter('originDns', index) as string;
		const originPort = this.getNodeParameter('originPort', index) as number;
		const createOptions = this.getNodeParameter('createOptions', index) as IDataObject;

		const body: IDataObject = {
			protocol,
			dns: { type: 'CNAME', name: dnsName },
			origin_dns: { name: originDns },
			origin_port: originPort,
		};

		Object.assign(body, createOptions);

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/spectrum/apps`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const appId = this.getNodeParameter('appId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/spectrum/apps/${appId}`,
		);
		return [{ json: { success: true, appId } }];
	}

	if (operation === 'get') {
		const appId = this.getNodeParameter('appId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/spectrum/apps/${appId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/spectrum/apps`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/spectrum/apps`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'update') {
		const appId = this.getNodeParameter('appId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = {};

		if (updateFields.origin_dns) {
			body.origin_dns = { name: updateFields.origin_dns };
		}
		if (updateFields.origin_port) {
			body.origin_port = updateFields.origin_port;
		}
		if (updateFields.argo_smart_routing !== undefined) {
			body.argo_smart_routing = updateFields.argo_smart_routing;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/spectrum/apps/${appId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
