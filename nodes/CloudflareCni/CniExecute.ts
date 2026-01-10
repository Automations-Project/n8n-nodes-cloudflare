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


	// NOTE: Update operation (PUT) is not available in the Cloudflare API for interconnects.
	// Only create (POST), list (GET), get (GET), and delete (DELETE) are supported.

	return [];
}
