import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const r2ObjectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['object'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an object from a bucket',
				action: 'Delete an object',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get object metadata',
				action: 'Get an object',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List objects in a bucket',
				action: 'List objects',
			},
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload an object to a bucket',
				action: 'Upload an object',
			},
		],
		default: 'getMany',
	},
];

export const r2ObjectFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['object'],
			},
		},
	},

	// ===========================================
	//         Bucket Name
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
				resource: ['object'],
			},
		},
	},

	// ===========================================
	//         Object Key (for get, delete, upload)
	// ===========================================
	{
		displayName: 'Object Key',
		name: 'objectKey',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'folder/filename.txt',
		description: 'Key (path) of the object in the bucket',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['get', 'delete', 'upload'],
			},
		},
	},

	// ===========================================
	//         Upload fields
	// ===========================================
	{
		displayName: 'Content Source',
		name: 'contentSource',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['upload'],
			},
		},
		options: [
			{
				name: 'Text',
				value: 'text',
			},
			{
				name: 'Binary (From Previous Node)',
				value: 'binary',
			},
		],
		default: 'text',
		description: 'Source of the object content',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		required: true,
		default: '',
		description: 'Text content to upload',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['upload'],
				contentSource: ['text'],
			},
		},
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		description: 'Name of the binary property containing the file data',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['upload'],
				contentSource: ['binary'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'uploadOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['upload'],
			},
		},
		options: [
			{
				displayName: 'Content Type',
				name: 'contentType',
				type: 'string',
				default: '',
				placeholder: 'application/json',
				description: 'MIME type of the object',
			},
			{
				displayName: 'Cache Control',
				name: 'cacheControl',
				type: 'string',
				default: '',
				placeholder: 'max-age=3600',
				description: 'Cache-Control header for the object',
			},
			{
				displayName: 'Body Mapping Field',
				name: 'bodyMappingField',
				type: 'string',
				default: '',
				placeholder: 'content',
				description: 'When specified, extracts this field from JSON input as the raw body. Useful for AI Agent tool calls that wrap content in JSON like {"fileName": "...", "content": "..."}.',
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
				resource: ['object'],
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
				resource: ['object'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'objectFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Prefix',
				name: 'prefix',
				type: 'string',
				default: '',
				placeholder: 'folder/',
				description: 'Filter objects by key prefix',
			},
			{
				displayName: 'Delimiter',
				name: 'delimiter',
				type: 'string',
				default: '',
				placeholder: '/',
				description: 'Character to group keys (for folder-like listing)',
			},
		],
	},
];
