import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const aiGatewayGatewayOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['gateway'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an AI Gateway',
				action: 'Create a gateway',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an AI Gateway',
				action: 'Delete a gateway',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get gateway details',
				action: 'Get a gateway',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all AI Gateways',
				action: 'List gateways',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an AI Gateway',
				action: 'Update a gateway',
			},
		],
		default: 'getMany',
	},
];

export const aiGatewayGatewayFields: INodeProperties[] = [
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
				resource: ['gateway'],
			},
		},
	},

	// ===========================================
	//         Gateway ID (for get, delete, update)
	// ===========================================
	{
		displayName: 'Gateway Name or ID',
		name: 'gatewayId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getAiGateways',
		loadOptionsDependsOn: ['accountId'],
		},
		description: 'ID of the AI Gateway. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['get', 'delete', 'update'],
			},
		},
	},

	// ===========================================
	//         Create fields
	// ===========================================
	{
		displayName: 'Gateway Name',
		name: 'gatewayName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the AI Gateway',
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'gatewayOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Cache Invalidate on Update',
				name: 'cacheInvalidateOnUpdate',
				type: 'boolean',
				default: true,
				description: 'Whether to invalidate cache when gateway is updated',
			},
			{
				displayName: 'Cache TTL',
				name: 'cacheTtl',
				type: 'number',
				default: 0,
				description: 'Cache time-to-live in seconds',
			},
			{
				displayName: 'Collect Logs',
				name: 'collectLogs',
				type: 'boolean',
				default: true,
				description: 'Whether to collect logs for this gateway',
			},
			{
				displayName: 'Rate Limiting Interval',
				name: 'rateLimitingInterval',
				type: 'number',
				default: 0,
				description: 'Rate limiting interval in seconds',
			},
			{
				displayName: 'Rate Limiting Limit',
				name: 'rateLimitingLimit',
				type: 'number',
				default: 0,
				description: 'Rate limiting request limit',
			},
			{
				displayName: 'Rate Limiting Technique',
				name: 'rateLimitingTechnique',
				type: 'options',
				options: [
					{ name: 'Fixed', value: 'fixed' },
					{ name: 'Sliding', value: 'sliding' },
				],
				default: 'fixed',
			},
		],
	},

	// ===========================================
	//         Update fields
	// ===========================================
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['gateway'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Cache Invalidate on Update',
				name: 'cacheInvalidateOnUpdate',
				type: 'boolean',
				default: true,
				description: 'Whether to invalidate cache when gateway is updated',
			},
			{
				displayName: 'Cache TTL',
				name: 'cacheTtl',
				type: 'number',
				default: 0,
				description: 'Cache time-to-live in seconds',
			},
			{
				displayName: 'Collect Logs',
				name: 'collectLogs',
				type: 'boolean',
				default: true,
				description: 'Whether to collect logs for this gateway',
			},
			{
				displayName: 'Rate Limiting Interval',
				name: 'rateLimitingInterval',
				type: 'number',
				default: 0,
				description: 'Rate limiting interval in seconds',
			},
			{
				displayName: 'Rate Limiting Limit',
				name: 'rateLimitingLimit',
				type: 'number',
				default: 0,
				description: 'Rate limiting request limit',
			},
		],
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
				resource: ['gateway'],
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
				resource: ['gateway'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
