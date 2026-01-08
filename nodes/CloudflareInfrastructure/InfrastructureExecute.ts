import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function infrastructureExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'listTargets') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/infrastructure/targets`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getTarget') {
		const targetId = this.getNodeParameter('targetId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/infrastructure/targets/${targetId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createTarget') {
		const hostname = this.getNodeParameter('hostname', index) as string;
		const ipAddress = this.getNodeParameter('ipAddress', index, '') as string;
		const body: IDataObject = { hostname };
		if (ipAddress) body.ip = { target_hostname: ipAddress };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/infrastructure/targets`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateTarget') {
		const targetId = this.getNodeParameter('targetId', index) as string;
		const ipAddress = this.getNodeParameter('ipAddress', index, '') as string;
		const body: IDataObject = {};
		if (ipAddress) body.ip = { target_hostname: ipAddress };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/infrastructure/targets/${targetId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteTarget') {
		const targetId = this.getNodeParameter('targetId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/infrastructure/targets/${targetId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
