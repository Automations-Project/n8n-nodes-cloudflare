import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function queuesMessageExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const queueName = this.getNodeParameter('queueName', itemIndex) as string;

	let responseData: IDataObject | undefined;

	if (operation === 'send') {
		const messageBodyStr = this.getNodeParameter('messageBody', itemIndex) as string;
		const sendOptions = this.getNodeParameter('sendOptions', itemIndex) as {
			contentType?: string;
			delaySeconds?: number;
		};

		let messageBody: IDataObject;
		try {
			messageBody = JSON.parse(messageBodyStr);
		} catch {
			throw new Error('Message Body must be valid JSON');
		}

		const body: IDataObject = {
			body: messageBody,
		};

		if (sendOptions.contentType) {
			body.content_type = sendOptions.contentType;
		}
		if (sendOptions.delaySeconds) {
			body.delay_seconds = sendOptions.delaySeconds;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/queues/${queueName}/messages`,
			body,
		);
	}

	if (operation === 'sendBatch') {
		const batchMessagesStr = this.getNodeParameter('batchMessages', itemIndex) as string;

		let messages: IDataObject[];
		try {
			messages = JSON.parse(batchMessagesStr);
		} catch {
			throw new Error('Messages must be a valid JSON array');
		}

		const body: IDataObject = {
			messages,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/queues/${queueName}/messages/batch`,
			body,
		);
	}

	if (operation === 'pull') {
		const pullOptions = this.getNodeParameter('pullOptions', itemIndex) as {
			batchSize?: number;
			visibilityTimeoutMs?: number;
		};

		const body: IDataObject = {};

		if (pullOptions.batchSize) {
			body.batch_size = pullOptions.batchSize;
		}
		if (pullOptions.visibilityTimeoutMs) {
			body.visibility_timeout_ms = pullOptions.visibilityTimeoutMs;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/queues/${queueName}/messages/pull`,
			body,
		);
	}

	if (operation === 'ack') {
		const leaseIdsStr = this.getNodeParameter('leaseIds', itemIndex) as string;
		const acks = leaseIdsStr.split(',').map((id) => ({
			lease_id: id.trim(),
		}));

		const body: IDataObject = {
			acks,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/queues/${queueName}/messages/ack`,
			body,
		);
	}

	// Normalize response
	const result: IDataObject[] = responseData
		? [responseData]
		: [{ success: true }];

	return result.map((item) => ({
		json: item,
		pairedItem: { item: itemIndex },
	}));
}
