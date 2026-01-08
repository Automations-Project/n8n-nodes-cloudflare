import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const monitorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['monitor'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a monitor',
				action: 'Create a monitor',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a monitor',
				action: 'Delete a monitor',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a monitor',
				action: 'Get a monitor',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List monitors',
				action: 'List monitors',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a monitor',
				action: 'Update a monitor',
			},
		],
		default: 'getMany',
	},
];

export const monitorFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['monitor'],
			},
		},
	},

	// ===========================================
	//         Monitor ID
	// ===========================================
	{
		displayName: 'Monitor ID',
		name: 'monitorId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the monitor',
		displayOptions: {
			show: {
				resource: ['monitor'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},

	// ===========================================
	//         Get Many Options
	// ===========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['monitor'],
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
				resource: ['monitor'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},

	// ===========================================
	//         Create fields
	// ===========================================
	{
		displayName: 'Expected Codes',
		name: 'expectedCodes',
		type: 'string',
		required: true,
		default: '200',
		placeholder: '200,201,301',
		description: 'Expected HTTP response codes (comma-separated)',
		displayOptions: {
			show: {
				resource: ['monitor'],
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
				resource: ['monitor'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Monitor description',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'number',
				default: 60,
				description: 'Interval between health checks in seconds',
			},
			{
				displayName: 'Retries',
				name: 'retries',
				type: 'number',
				default: 2,
				description: 'Number of retries before marking unhealthy',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 5,
				description: 'Timeout for health check in seconds',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'HTTP', value: 'http' },
					{ name: 'HTTPS', value: 'https' },
					{ name: 'TCP', value: 'tcp' },
					{ name: 'UDP ICMP', value: 'udp_icmp' },
					{ name: 'ICMP Ping', value: 'icmp_ping' },
				],
				default: 'https',
				description: 'Monitor type',
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
				resource: ['monitor'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Expected Codes',
				name: 'expectedCodes',
				type: 'string',
				default: '',
				description: 'Expected HTTP response codes',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Monitor description',
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'number',
				default: 60,
				description: 'Interval between health checks',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 5,
				description: 'Timeout in seconds',
			},
		],
	},
];
