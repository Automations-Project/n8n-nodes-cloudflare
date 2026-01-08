import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const rateLimitOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['rateLimit'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a rate limit rule',
				action: 'Create a rate limit rule',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a rate limit rule',
				action: 'Delete a rate limit rule',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get rate limit rule details',
				action: 'Get a rate limit rule',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List rate limit rules',
				action: 'Get many rate limit rules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a rate limit rule',
				action: 'Update a rate limit rule',
			},
		],
		default: 'getMany',
	},
];

export const rateLimitFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['rateLimit'],
			},
		},
	},
	{
		displayName: 'Rate Limit ID',
		name: 'rateLimitId',
		type: 'string',
		required: true,
		default: '',
		description: 'The rate limit identifier',
		displayOptions: {
			show: {
				resource: ['rateLimit'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Match URL Pattern',
		name: 'matchUrl',
		type: 'string',
		required: true,
		default: '',
		placeholder: '*example.com/api/*',
		description: 'URL pattern to match requests',
		displayOptions: {
			show: {
				resource: ['rateLimit'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Threshold',
		name: 'threshold',
		type: 'number',
		required: true,
		default: 100,
		description: 'Number of requests allowed in the period',
		displayOptions: {
			show: {
				resource: ['rateLimit'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Period (Seconds)',
		name: 'period',
		type: 'number',
		required: true,
		default: 60,
		description: 'Time period in seconds',
		displayOptions: {
			show: {
				resource: ['rateLimit'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Action',
		name: 'actionMode',
		type: 'options',
		options: [
			{ name: 'Block', value: 'ban' },
			{ name: 'Challenge', value: 'challenge' },
			{ name: 'JS Challenge', value: 'js_challenge' },
			{ name: 'Managed Challenge', value: 'managed_challenge' },
			{ name: 'Simulate', value: 'simulate' },
		],
		default: 'ban',
		required: true,
		description: 'Action to take when threshold is exceeded',
		displayOptions: {
			show: {
				resource: ['rateLimit'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Action Timeout (Seconds)',
		name: 'actionTimeout',
		type: 'number',
		default: 3600,
		description: 'Duration of the action in seconds',
		displayOptions: {
			show: {
				resource: ['rateLimit'],
				operation: ['create'],
				actionMode: ['ban'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['rateLimit'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Action Mode',
				name: 'action_mode',
				type: 'options',
				options: [
					{ name: 'Block', value: 'ban' },
					{ name: 'Challenge', value: 'challenge' },
					{ name: 'JS Challenge', value: 'js_challenge' },
				],
				default: 'ban',
				description: 'Action to take',
			},
			{
				displayName: 'Disabled',
				name: 'disabled',
				type: 'boolean',
				default: false,
				description: 'Whether to disable the rule',
			},
			{
				displayName: 'Period',
				name: 'period',
				type: 'number',
				default: 60,
				description: 'Time period in seconds',
			},
			{
				displayName: 'Threshold',
				name: 'threshold',
				type: 'number',
				default: 100,
				description: 'Request threshold',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['rateLimit'],
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
				resource: ['rateLimit'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
