import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function requestTracerExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'trace') {
		const url = this.getNodeParameter('url', index) as string;
		const method = this.getNodeParameter('method', index) as string;
		const body = { url, method };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/request-tracer/trace`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
