import { INodeProperties } from 'n8n-workflow';
import { accountIdField, zoneIdField } from '../shared/SharedFields';

export const logpushJobOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['job'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a logpush job',
				action: 'Create a logpush job',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a logpush job',
				action: 'Delete a logpush job',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a logpush job',
				action: 'Get a logpush job',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List logpush jobs',
				action: 'List logpush jobs',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a logpush job',
				action: 'Update a logpush job',
			},
			{
				name: 'Validate',
				value: 'validate',
				description: 'Validate destination',
				action: 'Validate destination',
			},
		],
		default: 'getMany',
	},
	// Dataset Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dataset'] } },
		options: [
			{ name: 'Get Fields', value: 'getFields', description: 'Get dataset fields', action: 'Get dataset fields' },
			{ name: 'Get Jobs', value: 'getJobs', description: 'List jobs by dataset', action: 'Get dataset jobs' },
		],
		default: 'getFields',
	},
	// Edge Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['edge'] } },
		options: [
			{ name: 'Create Edge Job', value: 'createEdge', description: 'Create an edge job', action: 'Create edge job' },
		],
		default: 'createEdge',
	},
];

export const logpushJobFields: INodeProperties[] = [
	// ===========================================
	//         Scope Fields (Zone ID / Account ID)
	// ===========================================
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['job'],
				scope: ['zone'],
			},
		},
	},
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['job'],
				scope: ['account'],
			},
		},
	},

	// ===========================================
	//         Job ID
	// ===========================================
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string', // Could be integer? "id": 12345. Usually string in n8n.
		required: true,
		default: '',
		description: 'Logpush Job ID',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},

	// ===========================================
	//         Create/Update Fields
	// ===========================================
	{
		displayName: 'Dataset',
		name: 'dataset',
		type: 'string', // Could be options if we fetch datasets? 'http_requests', 'firewall_events', etc.
		required: true,
		default: '',
		description: 'The dataset to push (e.g. http_requests, firewall_events)',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create', 'validate'],
			},
		},
	},
	{
		displayName: 'Destination URL',
		name: 'destination_conf',
		type: 'string',
		required: true,
		default: '',
		description: 'The destination URL (e.g. s3://bucket/path?region=us-east-1)',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create', 'validate', 'update'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Optional job name',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Logpull Options',
		name: 'logpull_options',
		type: 'string',
		default: '',
		description: 'Configuration string for the logpush job (e.g. fields=ClientIP,EdgeStartTimestamp&timestamps=rfc3339)',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		description: 'Whether the job is enabled',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create', 'update'],
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
				resource: ['job'],
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
				resource: ['job'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	// Dataset Fields
	{
		displayName: 'Dataset ID',
		name: 'datasetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dataset'] } },
	},
	// Edge Fields
	{
		displayName: 'Job Config (JSON)',
		name: 'edgeJobConfig',
		type: 'json',
		default: '{"fields": "RayID,ClientIP,EdgeStartTimestamp", "sample": 1}',
		displayOptions: { show: { resource: ['edge'] } },
	},
];
