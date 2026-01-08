import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function botnetFeedExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const asnId = this.getNodeParameter('asnId', index) as string;

	if (operation === 'getDayReport') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/botnet_feed/asn/${asnId}/day_report`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getFullReport') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/botnet_feed/asn/${asnId}/full_report`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteConfig') {
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/botnet_feed/configs/asn/${asnId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
