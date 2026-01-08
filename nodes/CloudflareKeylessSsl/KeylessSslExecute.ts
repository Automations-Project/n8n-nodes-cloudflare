import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function keylessSslExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const host = this.getNodeParameter('host', index) as string;
		const port = this.getNodeParameter('port', index) as number;
		const certificate = this.getNodeParameter('certificate', index) as string;
		const createOptions = this.getNodeParameter('createOptions', index) as IDataObject;

		const body: IDataObject = {
			host,
			port,
			certificate,
			...createOptions,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/keyless_certificates`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const keylessSslId = this.getNodeParameter('keylessSslId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/keyless_certificates/${keylessSslId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const keylessSslId = this.getNodeParameter('keylessSslId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/keyless_certificates/${keylessSslId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(
			this,
			'GET',
			`/zones/${zoneId}/keyless_certificates`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'update') {
		const keylessSslId = this.getNodeParameter('keylessSslId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/keyless_certificates/${keylessSslId}`,
			updateFields,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
