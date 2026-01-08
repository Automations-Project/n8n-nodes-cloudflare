import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const vectorizeVectorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['vector'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete vectors by IDs',
				action: 'Delete vectors',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get vectors by IDs',
				action: 'Get vectors',
			},
			{
				name: 'Query',
				value: 'query',
				description: 'Query similar vectors',
				action: 'Query vectors',
			},
			{
				name: 'Create or Update',
				value: 'upsert',
				description: 'Create a new record, or update the current one if it already exists (upsert)',
				action: 'Upsert vectors',
			},
		],
		default: 'query',
	},
];

export const vectorizeVectorFields: INodeProperties[] = [
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
				resource: ['vector'],
			},
		},
	},

	// ===========================================
	//         Index Name
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
				resource: ['vector'],
			},
		},
	},

	// ===========================================
	//         Query fields
	// ===========================================
	{
		displayName: 'Query Vector',
		name: 'queryVector',
		type: 'string',
		required: true,
		default: '',
		placeholder: '[0.1, 0.2, 0.3, ...]',
		description: 'The query vector as a JSON array of numbers',
		displayOptions: {
			show: {
				resource: ['vector'],
				operation: ['query'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'queryOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['vector'],
				operation: ['query'],
			},
		},
		options: [
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'json',
				default: '{}',
				description: 'Metadata filter as JSON object',
			},
			{
				displayName: 'Return Metadata',
				name: 'returnMetadata',
				type: 'boolean',
				default: true,
				description: 'Whether to return vector metadata',
			},
			{
				displayName: 'Return Values',
				name: 'returnValues',
				type: 'boolean',
				default: false,
				description: 'Whether to return vector values',
			},
			{
				displayName: 'Top K',
				name: 'topK',
				type: 'number',
				default: 10,
				description: 'Number of similar vectors to return',
			},
		],
	},

	// ===========================================
	//         Upsert fields
	// ===========================================
	{
		displayName: 'Vectors',
		name: 'vectors',
		type: 'json',
		required: true,
		default: '[\n  {\n    "id": "vec1",\n    "values": [0.1, 0.2, 0.3],\n    "metadata": {"key": "value"}\n  }\n]',
		description: 'Array of vectors to upsert. Each vector must have ID, values, and optional metadata.',
		displayOptions: {
			show: {
				resource: ['vector'],
				operation: ['upsert'],
			},
		},
	},

	// ===========================================
	//         Get/Delete by IDs
	// ===========================================
	{
		displayName: 'Vector IDs',
		name: 'vectorIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'vec1, vec2, vec3',
		description: 'Comma-separated list of vector IDs',
		displayOptions: {
			show: {
				resource: ['vector'],
				operation: ['get', 'delete'],
			},
		},
	},
];
