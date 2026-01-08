import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const healthcheckOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['healthcheck'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a healthcheck',
				action: 'Create a healthcheck',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a healthcheck',
				action: 'Delete a healthcheck',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get healthcheck details',
				action: 'Get a healthcheck',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List healthchecks',
				action: 'List healthchecks',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a healthcheck',
				action: 'Update a healthcheck',
			},
		],
		default: 'getMany',
	},
];

export const healthcheckFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['healthcheck'],
			},
		},
	},
	{
		displayName: 'Healthcheck ID',
		name: 'healthcheckId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the healthcheck',
		displayOptions: {
			show: {
				resource: ['healthcheck'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Display name for the healthcheck',
		displayOptions: {
			show: {
				resource: ['healthcheck'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com or 192.0.2.1',
		description: 'The hostname or IP address to check',
		displayOptions: {
			show: {
				resource: ['healthcheck'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'HTTP', value: 'HTTP' },
			{ name: 'HTTPS', value: 'HTTPS' },
			{ name: 'TCP', value: 'TCP' },
		],
		default: 'HTTPS',
		required: true,
		description: 'Type of healthcheck',
		displayOptions: {
			show: {
				resource: ['healthcheck'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Create Options',
		name: 'createOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['healthcheck'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Check Regions',
				name: 'check_regions',
				type: 'multiOptions',
				options: [
					{ name: 'All Regions', value: 'ALL_REGIONS' },
					{ name: 'Eastern Asia', value: 'EEU' },
					{ name: 'Eastern North America', value: 'ENAM' },
					{ name: 'Western Europe', value: 'WEU' },
					{ name: 'Western North America', value: 'WNAM' },
				],
				default: ['ALL_REGIONS'],
				description: 'Regions to run the healthcheck from',
			},
			{
				displayName: 'Consecutive Fails',
				name: 'consecutive_fails',
				type: 'number',
				default: 1,
				description: 'Number of consecutive failures before marking unhealthy',
			},
			{
				displayName: 'Consecutive Successes',
				name: 'consecutive_successes',
				type: 'number',
				default: 1,
				description: 'Number of consecutive successes before marking healthy',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description for the healthcheck',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'number',
				default: 60,
				description: 'Interval between checks in seconds',
			},
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '/',
				description: 'Path to check (for HTTP/HTTPS)',
			},
			{
				displayName: 'Port',
				name: 'port',
				type: 'number',
				default: 443,
				description: 'Port to check',
			},
			{
				displayName: 'Suspended',
				name: 'suspended',
				type: 'boolean',
				default: false,
				description: 'Whether the healthcheck is suspended',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 5,
				description: 'Timeout for each check in seconds',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['healthcheck'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				description: 'The hostname or IP address to check',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description for the healthcheck',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Display name for the healthcheck',
			},
			{
				displayName: 'Suspended',
				name: 'suspended',
				type: 'boolean',
				default: false,
				description: 'Whether the healthcheck is suspended',
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
				resource: ['healthcheck'],
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
				resource: ['healthcheck'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
