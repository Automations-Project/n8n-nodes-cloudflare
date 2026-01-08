import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function browserRenderingExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const url = this.getNodeParameter('url', index) as string;
	const waitTime = this.getNodeParameter('waitTime', index, 0) as number;

	const body: IDataObject = { url };
	if (waitTime > 0) body.wait = waitTime;

	if (operation === 'getContent') {
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/browser-rendering/content`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getScreenshot') {
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/browser-rendering/screenshot`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getPdf') {
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/browser-rendering/pdf`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'scrape') {
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/browser-rendering/scrape`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
