import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function fallbackOriginExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'delete') {
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/custom_hostnames/fallback_origin`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/custom_hostnames/fallback_origin`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const origin = this.getNodeParameter('origin', index) as string;
		const body = { origin };

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/custom_hostnames/fallback_origin`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
