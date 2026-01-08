import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function securityTxtExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'delete') {
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/security-center/securitytxt`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/security-center/securitytxt`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const contact = this.getNodeParameter('contact', index) as string;
		const options = this.getNodeParameter('options', index) as IDataObject;

		const body: IDataObject = {
			contact,
			...options,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/security-center/securitytxt`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
