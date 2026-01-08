import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function secondaryDnsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'forceAxfr') {
		const response = await cloudflareApiRequest.call(this, 'POST', `/zones/${zoneId}/secondary_dns/force_axfr`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getIncoming') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/secondary_dns/incoming`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createIncoming') {
		const primaryNs = this.getNodeParameter('primaryNs', index) as string;
		const tsigId = this.getNodeParameter('tsigId', index, '') as string;
		const body: IDataObject = { auto_refresh_seconds: 86400, primary_ns: primaryNs };
		if (tsigId) body.tsig_id = tsigId;
		const response = await cloudflareApiRequest.call(this, 'POST', `/zones/${zoneId}/secondary_dns/incoming`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateIncoming') {
		const tsigId = this.getNodeParameter('tsigId', index, '') as string;
		const body: IDataObject = {};
		if (tsigId) body.tsig_id = tsigId;
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/secondary_dns/incoming`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteIncoming') {
		await cloudflareApiRequest.call(this, 'DELETE', `/zones/${zoneId}/secondary_dns/incoming`);
		return [{ json: { success: true } }];
	}

	if (operation === 'getOutgoing') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/secondary_dns/outgoing`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateOutgoing') {
		const peers = JSON.parse(this.getNodeParameter('peers', index) as string);
		const body = { peers };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/secondary_dns/outgoing`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
