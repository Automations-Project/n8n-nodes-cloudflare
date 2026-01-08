import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const queuesMessageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
		options: [
			{
				name: 'Acknowledge',
				value: 'ack',
				description: 'Acknowledge messages',
				action: 'Acknowledge messages',
			},
			{
				name: 'Pull',
				value: 'pull',
				description: 'Pull messages from a queue',
				action: 'Pull messages',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send a message to a queue',
				action: 'Send a message',
			},
			{
				name: 'Send Batch',
				value: 'sendBatch',
				description: 'Send multiple messages to a queue',
				action: 'Send batch messages',
			},
		],
		default: 'send',
	},
];

export const queuesMessageFields: INodeProperties[] = [
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
				resource: ['message'],
			},
		},
	},

	// ===========================================
	//         Queue Name
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
				resource: ['message'],
			},
		},
	},

	// ===========================================
	//         Send Message fields
	// ===========================================
	{
		displayName: 'Message Body',
		name: 'messageBody',
		type: 'json',
		required: true,
		default: '{}',
		description: 'The message body as JSON',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'sendOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		options: [
			{
				displayName: 'Content Type',
				name: 'contentType',
				type: 'options',
				options: [
					{ name: 'JSON', value: 'json' },
					{ name: 'Text', value: 'text' },
					{ name: 'V8', value: 'v8' },
				],
				default: 'json',
				description: 'Content type of the message',
			},
			{
				displayName: 'Delay Seconds',
				name: 'delaySeconds',
				type: 'number',
				default: 0,
				description: 'Delay before the message becomes visible',
			},
		],
	},

	// ===========================================
	//         Send Batch fields
	// ===========================================
	{
		displayName: 'Messages',
		name: 'batchMessages',
		type: 'json',
		required: true,
		default: '[\n  {"body": {"key": "value1"}},\n  {"body": {"key": "value2"}}\n]',
		description: 'Array of messages to send. Each message must have a "body" field.',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendBatch'],
			},
		},
	},

	// ===========================================
	//         Pull Message fields
	// ===========================================
	{
		displayName: 'Options',
		name: 'pullOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['pull'],
			},
		},
		options: [
			{
				displayName: 'Batch Size',
				name: 'batchSize',
				type: 'number',
				default: 10,
				description: 'Maximum number of messages to pull',
			},
			{
				displayName: 'Visibility Timeout (Ms)',
				name: 'visibilityTimeoutMs',
				type: 'number',
				default: 30000,
				description: 'How long messages are hidden from other consumers',
			},
		],
	},

	// ===========================================
	//         Acknowledge fields
	// ===========================================
	{
		displayName: 'Lease IDs',
		name: 'leaseIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'lease1, lease2',
		description: 'Comma-separated list of lease IDs to acknowledge',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['ack'],
			},
		},
	},
];
