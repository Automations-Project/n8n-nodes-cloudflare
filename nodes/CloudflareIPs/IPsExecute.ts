import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function ipsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/ips`);
		return [{ json: response as IDataObject }];
	}

	return [];
}
