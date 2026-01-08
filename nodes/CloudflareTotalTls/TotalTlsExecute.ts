import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function totalTlsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/acm/total_tls`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const enabled = this.getNodeParameter('enabled', index) as boolean;
		const certificateAuthority = this.getNodeParameter('certificateAuthority', index) as string;

		const body = {
			enabled,
			certificate_authority: certificateAuthority,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/acm/total_tls`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
