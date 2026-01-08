import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function mtlsCertExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'create') {
		const certificates = this.getNodeParameter('certificates', index) as string;
		const ca = this.getNodeParameter('ca', index) as boolean;
		const name = this.getNodeParameter('name', index) as string;
		const privateKey = this.getNodeParameter('privateKey', index) as string;

		const body: IDataObject = {
			certificates,
			ca,
		};

		if (name) body.name = name;
		if (privateKey) body.private_key = privateKey;

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/mtls_certificates`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/mtls_certificates/${certificateId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/mtls_certificates/${certificateId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getAssociations') {
		const certificateId = this.getNodeParameter('certificateId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/mtls_certificates/${certificateId}/associations`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(
			this,
			'GET',
			`/accounts/${accountId}/mtls_certificates`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	return [];
}
