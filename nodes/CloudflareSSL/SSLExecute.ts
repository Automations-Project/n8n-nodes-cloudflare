import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function sslExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/ssl/universal/settings`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const enabled = this.getNodeParameter('enabled', index) as boolean;
		const body = { enabled };
		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/ssl/universal/settings`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'analyze') {
		const bundleMethod = this.getNodeParameter('bundleMethod', index) as string;
		const certificate = this.getNodeParameter('certificate', index) as string;

		const body: IDataObject = {
			bundle_method: bundleMethod,
		};

		if (certificate) {
			body.certificate = certificate;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/ssl/analyze`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getVerification') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/ssl/verification`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	return [];
}

