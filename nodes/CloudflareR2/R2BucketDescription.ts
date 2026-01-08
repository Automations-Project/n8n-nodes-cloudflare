import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const r2BucketOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['bucket'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new R2 bucket',
				action: 'Create a bucket',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an R2 bucket',
				action: 'Delete a bucket',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get bucket details',
				action: 'Get a bucket',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all R2 buckets',
				action: 'List buckets',
			},
		],
		default: 'getMany',
	},
];

export const r2BucketFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['bucket'],
			},
		},
	},

	// ===========================================
	//         Bucket Name (for create, get, delete)
	// ===========================================
	{
		displayName: 'Bucket Name or ID',
		name: 'bucketName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getR2Buckets',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'Name of the R2 bucket. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['bucket'],
				operation: ['get', 'delete'],
			},
		},
	},
	{
		displayName: 'Bucket Name',
		name: 'bucketName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the R2 bucket to create',
		displayOptions: {
			show: {
				resource: ['bucket'],
				operation: ['create'],
			},
		},
	},

	// ===========================================
	//         Create options
	// ===========================================
	{
		displayName: 'Options',
		name: 'bucketOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['bucket'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Location Hint',
				name: 'locationHint',
				type: 'options',
				options: [
					{ name: 'Automatic', value: '' },
					{ name: 'Eastern North America (Enam)', value: 'enam' },
					{ name: 'Western North America (Wnam)', value: 'wnam' },
					{ name: 'Western Europe (Weur)', value: 'weur' },
					{ name: 'Eastern Europe (Eeur)', value: 'eeur' },
					{ name: 'Asia Pacific (Apac)', value: 'apac' },
				],
				default: '',
				description: 'Preferred location for the bucket',
			},
			{
				displayName: 'Storage Class',
				name: 'storageClass',
				type: 'options',
				options: [
					{ name: 'Standard', value: 'Standard' },
					{ name: 'Infrequent Access', value: 'InfrequentAccess' },
				],
				default: 'Standard',
				description: 'Storage class for the bucket',
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
				resource: ['bucket'],
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
				resource: ['bucket'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
