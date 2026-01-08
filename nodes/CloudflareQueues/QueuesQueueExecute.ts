import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function queuesQueueExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/queues`,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			const qs: IDataObject = { per_page: limit };
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/queues`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const queueName = this.getNodeParameter('queueName', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/queues/${queueName}`,
		);
	}

	if (operation === 'create') {
		const queueName = this.getNodeParameter('queueName', itemIndex) as string;

		const body: IDataObject = {
			queue_name: queueName,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/queues`,
			body,
		);
	}

	if (operation === 'delete') {
		const queueName = this.getNodeParameter('queueName', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/queues/${queueName}`,
		);

		responseData = { success: true, deleted: queueName };
	}

	if (operation === 'purge') {
		const queueName = this.getNodeParameter('queueName', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/queues/${queueName}/purge`,
		);
	}

	// Normalize response
	const result: IDataObject[] = Array.isArray(responseData)
		? responseData
		: responseData
			? [responseData]
			: [{ success: true }];

	return result.map((item) => ({
		json: item,
		pairedItem: { item: itemIndex },
	}));
}
