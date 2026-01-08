import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function zeroTrustConnectivityExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getSettings') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/zerotrust/connectivity_settings`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateSettings') {
		const icmpProxyEnabled = this.getNodeParameter('icmpProxyEnabled', index) as boolean;
		const offrampWanDisabled = this.getNodeParameter('offrampWanDisabled', index) as boolean;
		const body = { icmp_proxy_enabled: icmpProxyEnabled, offramp_warp_enabled: !offrampWanDisabled };
		const response = await cloudflareApiRequest.call(this, 'PATCH', `/accounts/${accountId}/zerotrust/connectivity_settings`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
