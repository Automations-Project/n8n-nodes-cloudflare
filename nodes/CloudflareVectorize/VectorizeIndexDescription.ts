import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const vectorizeIndexOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['index'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new vector index',
				action: 'Create an index',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a vector index',
				action: 'Delete an index',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get index details',
				action: 'Get an index',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all vector indexes',
				action: 'List indexes',
			},
		],
		default: 'getMany',
	},
];

export const vectorizeIndexFields: INodeProperties[] = [
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
				resource: ['index'],
			},
		},
	},

	// ===========================================
	//         Index Name (for get, delete)
	// ===========================================
	{
		displayName: 'Index Name or ID',
		name: 'indexName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getVectorizeIndexes',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'Name of the vector index. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['index'],
				operation: ['get', 'delete'],
			},
		},
	},
	{
		displayName: 'Index Name',
		name: 'indexName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the vector index to create',
		displayOptions: {
			show: {
				resource: ['index'],
				operation: ['create'],
			},
		},
	},

	// ===========================================
	//         Create fields
	// ===========================================
	{
		displayName: 'Dimensions',
		name: 'dimensions',
		type: 'number',
		required: true,
		default: 1536,
		description: 'Number of dimensions for vectors (e.g., 1536 for OpenAI embeddings)',
		displayOptions: {
			show: {
				resource: ['index'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Metric',
		name: 'metric',
		type: 'options',
		required: true,
		options: [
			{ name: 'Cosine', value: 'cosine' },
			{ name: 'Euclidean', value: 'euclidean' },
			{ name: 'Dot Product', value: 'dot-product' },
		],
		default: 'cosine',
		description: 'Distance metric for similarity search',
		displayOptions: {
			show: {
				resource: ['index'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'indexOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['index'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the index',
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
				resource: ['index'],
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
				resource: ['index'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
