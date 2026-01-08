import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function cniExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'listInterconnects') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/cni/interconnects`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getInterconnect') {
		const interconnectId = this.getNodeParameter('interconnectId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/cni/interconnects/${interconnectId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateInterconnect') {
		const interconnectId = this.getNodeParameter('interconnectId', index) as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const body: IDataObject = {};
		if (description) body.description = description;
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/cni/interconnects/${interconnectId}`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
