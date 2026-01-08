import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function pcapsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/pcaps`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const pcapId = this.getNodeParameter('pcapId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/pcaps/${pcapId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const system = this.getNodeParameter('system', index) as string;
		const timeLimit = this.getNodeParameter('timeLimit', index) as number;
		const packetLimit = this.getNodeParameter('packetLimit', index) as number;
		const body = { system, time_limit: timeLimit, packet_limit: packetLimit, type: 'simple' };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/pcaps`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'download') {
		const pcapId = this.getNodeParameter('pcapId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/pcaps/${pcapId}/download`);
		return [{ json: response as IDataObject }];
	}

	return [];
}
