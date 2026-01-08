import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function customCertificatesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const certificate = this.getNodeParameter('certificate', index) as string;
		const privateKey = this.getNodeParameter('privateKey', index) as string;
		const createOptions = this.getNodeParameter('createOptions', index) as IDataObject;

		const body: IDataObject = {
			certificate,
			private_key: privateKey,
			...createOptions,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/custom_certificates`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/custom_certificates/${certificateId}`,
		);
		return [{ json: { success: true, certificateId } }];
	}

	if (operation === 'get') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/custom_certificates/${certificateId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/custom_certificates`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/custom_certificates`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'update') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/custom_certificates/${certificateId}`,
			updateFields,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'prioritize') {
		const certificatesJson = this.getNodeParameter('certificatesJson', index) as string;
		const certificates = JSON.parse(certificatesJson);

		const body = { certificates };

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/custom_certificates/prioritize`,
			body,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	return [];
}

