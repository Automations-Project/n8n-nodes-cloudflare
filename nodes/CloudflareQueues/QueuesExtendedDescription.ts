import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

// Consumer Operations
export const queuesConsumerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['consumer'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a consumer', action: 'Create consumer' },
			{ name: 'Delete', value: 'delete', description: 'Delete a consumer', action: 'Delete consumer' },
			{ name: 'Get', value: 'get', description: 'Get a consumer', action: 'Get consumer' },
			{ name: 'Get Many', value: 'getMany', description: 'List consumers', action: 'List consumers' },
			{ name: 'Update', value: 'update', description: 'Update a consumer', action: 'Update consumer' },
		],
		default: 'getMany',
	},
];

export const queuesConsumerFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['consumer'] } } },
	{
		displayName: 'Queue Name or ID',
		name: 'consumerQueueName',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getQueues',
			loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		displayOptions: { show: { resource: ['consumer'] } },
	},
	{
		displayName: 'Consumer ID',
		name: 'consumerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['consumer'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Script Name or ID',
		name: 'consumerScript',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getWorkerScripts',
			loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		displayOptions: { show: { resource: ['consumer'], operation: ['create'] } },
	},
	{
		displayName: 'Batch Size',
		name: 'consumerBatchSize',
		type: 'number',
		default: 10,
		displayOptions: { show: { resource: ['consumer'], operation: ['create', 'update'] } },
	},
];
