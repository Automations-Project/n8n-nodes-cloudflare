import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const queuesQueueOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['queue'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new queue',
				action: 'Create a queue',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a queue',
				action: 'Delete a queue',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get queue details',
				action: 'Get a queue',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all queues',
				action: 'List queues',
			},
			{
				name: 'Purge',
				value: 'purge',
				description: 'Purge all messages from a queue',
				action: 'Purge a queue',
			},
		],
		default: 'getMany',
	},
];

export const queuesQueueFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['queue'],
			},
		},
	},

	// ===========================================
	//         Queue Name (for get, delete, purge)
	// ===========================================
	{
		displayName: 'Queue Name or ID',
		name: 'queueName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getQueues',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'Name of the queue. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['get', 'delete', 'purge'],
			},
		},
	},
	{
		displayName: 'Queue Name',
		name: 'queueName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the queue to create',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['create'],
			},
		},
	},

	// ===========================================
	//         Get Many options
	// ===========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
