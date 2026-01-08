import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function billingExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getProfile') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/billing/profile`);
		return [{ json: response as IDataObject }];
	}

	return [];
}
