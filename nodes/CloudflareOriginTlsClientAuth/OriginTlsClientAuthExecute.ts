import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function originTlsClientAuthExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const certificate = this.getNodeParameter('certificate', index) as string;
		const privateKey = this.getNodeParameter('privateKey', index) as string;

		const body = {
			certificate,
			private_key: privateKey,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/origin_tls_client_auth`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/origin_tls_client_auth/${certificateId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/origin_tls_client_auth/${certificateId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(
			this,
			'GET',
			`/zones/${zoneId}/origin_tls_client_auth`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'getSettings') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/origin_tls_client_auth/settings`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateSettings') {
		const enabled = this.getNodeParameter('enabled', index) as boolean;

		const body = { enabled };

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/origin_tls_client_auth/settings`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
