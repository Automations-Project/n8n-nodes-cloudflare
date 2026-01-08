import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function urlNormalizationExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/url_normalization`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const scope = this.getNodeParameter('scope', index) as string;
		const type = this.getNodeParameter('type', index) as string;

		const body = { scope, type };

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/url_normalization`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
