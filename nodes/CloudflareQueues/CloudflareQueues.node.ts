import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { queuesQueueOperations, queuesQueueFields } from './QueuesQueueDescription';
import { queuesMessageOperations, queuesMessageFields } from './QueuesMessageDescription';
import { queuesConsumerOperations, queuesConsumerFields } from './QueuesExtendedDescription';
import { queuesQueueExecute } from './QueuesQueueExecute';
import { queuesMessageExecute } from './QueuesMessageExecute';
import { queuesConsumerExecute } from './QueuesExtendedExecute';
import { getAccounts, getQueues, getWorkerScripts } from '../shared/SharedMethods';

export class CloudflareQueues implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getQueues,
			getWorkerScripts,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare Queues',
		name: 'cloudflareQueues',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Queues and messages',
		defaults: {
			name: 'Cloudflare Queues',
		},
		inputs: ['main'],
		usableAsTool: true,
		outputs: ['main'],
		credentials: [
			{
				name: 'cloudflareApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.cloudflare.com/client/v4',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Consumer',
						value: 'consumer',
					},
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Queue',
						value: 'queue',
					},
				],
				default: 'queue',
			},
			...queuesConsumerOperations,
			...queuesConsumerFields,
			...queuesQueueOperations,
			...queuesQueueFields,
			...queuesMessageOperations,
			...queuesMessageFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'consumer') {
					result = await queuesConsumerExecute.call(this, i);
				} else if (resource === 'queue') {
					result = await queuesQueueExecute.call(this, i);
				} else if (resource === 'message') {
					result = await queuesMessageExecute.call(this, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
