import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function clientCertificatesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const validityDays = this.getNodeParameter('validityDays', index) as number;
		const csr = this.getNodeParameter('csr', index) as string;

		const body: IDataObject = {
			validity_days: validityDays,
		};

		if (csr) {
			body.csr = csr;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/client_certificates`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/client_certificates/${certificateId}`,
		);
		return [{ json: { success: true, certificateId } }];
	}

	if (operation === 'get') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/client_certificates/${certificateId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/client_certificates`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/client_certificates`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'update') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = { ...updateFields };

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/client_certificates/${certificateId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
