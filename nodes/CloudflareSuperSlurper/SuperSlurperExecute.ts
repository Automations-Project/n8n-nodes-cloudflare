import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function superSlurperExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/slurper/jobs`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getJob') {
		const jobId = this.getNodeParameter('jobId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/slurper/jobs/${jobId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createJob') {
		const sourceBucket = this.getNodeParameter('sourceBucket', index) as string;
		const destinationBucket = this.getNodeParameter('destinationBucket', index) as string;
		const provider = this.getNodeParameter('provider', index) as string;
		const body = { source: { bucket: sourceBucket, provider }, destination: { bucket: destinationBucket } };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/slurper/jobs`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'abortJob') {
		const jobId = this.getNodeParameter('jobId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/slurper/jobs/${jobId}/abort`);
		return [{ json: response as IDataObject }];
	}

	return [];
}
