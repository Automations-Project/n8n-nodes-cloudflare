import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function originCaExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'create') {
		const hostnamesStr = this.getNodeParameter('hostnames', index) as string;
		const requestType = this.getNodeParameter('requestType', index) as string;
		const validityDays = this.getNodeParameter('validityDays', index) as number;
		const csr = this.getNodeParameter('csr', index) as string;

		const hostnames = hostnamesStr.split(',').map((h) => h.trim());

		const body: IDataObject = {
			hostnames,
			request_type: requestType,
			requested_validity: validityDays,
		};

		if (csr) {
			body.csr = csr;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			'/certificates',
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/certificates/${certificateId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const zoneId = this.getNodeParameter('zoneId', index) as string;
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		const qs: IDataObject = { zone_id: zoneId };

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				'/certificates',
				{},
				qs,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.per_page = limit;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				'/certificates',
				{},
				qs,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'revoke') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/certificates/${certificateId}`,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
