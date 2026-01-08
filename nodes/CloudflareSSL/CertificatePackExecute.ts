import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function certificatePackExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const type = this.getNodeParameter('type', index) as string;
		const hostsStr = this.getNodeParameter('hosts', index) as string;
		const validationMethod = this.getNodeParameter('validationMethod', index) as string;
		const validityDays = this.getNodeParameter('validityDays', index) as number;
		const certificateAuthority = this.getNodeParameter('certificateAuthority', index) as string;

		const hosts = hostsStr.split(',').map(s => s.trim()).filter(s => s);

		const body = {
			type,
			hosts,
			validation_method: validationMethod,
			validity_days: validityDays,
			certificate_authority: certificateAuthority,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/ssl/certificate_packs/order`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const certificatePackId = this.getNodeParameter('certificatePackId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/ssl/certificate_packs/${certificatePackId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const certificatePackId = this.getNodeParameter('certificatePackId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/ssl/certificate_packs/${certificatePackId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const status = this.getNodeParameter('status', index) as string;
		const qs: IDataObject = {};
		if (status !== 'all') {
			qs.status = status;
		}

		const response = await cloudflareApiRequestAllItems.call(
			this,
			'GET',
			`/zones/${zoneId}/ssl/certificate_packs`,
			{},
			qs,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'getQuota') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/ssl/certificate_packs/quota`,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
