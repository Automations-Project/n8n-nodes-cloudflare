import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

// Consumer Execute Handler
export async function queuesConsumerExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const queueName = this.getNodeParameter('consumerQueueName', index) as string;
	const basePath = `/accounts/${accountId}/queues/${queueName}/consumers`;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}
	if (operation === 'get') {
		const consumerId = this.getNodeParameter('consumerId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${consumerId}`);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'create') {
		const script = this.getNodeParameter('consumerScript', index) as string;
		const batchSize = this.getNodeParameter('consumerBatchSize', index) as number;
		const body = { script_name: script, settings: { batch_size: batchSize } };
		const response = await cloudflareApiRequest.call(this, 'POST', basePath, body);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'update') {
		const consumerId = this.getNodeParameter('consumerId', index) as string;
		const batchSize = this.getNodeParameter('consumerBatchSize', index) as number;
		const body = { settings: { batch_size: batchSize } };
		const response = await cloudflareApiRequest.call(this, 'PUT', `${basePath}/${consumerId}`, body);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'delete') {
		const consumerId = this.getNodeParameter('consumerId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${consumerId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
