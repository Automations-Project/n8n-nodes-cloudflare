import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const aiModelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['model'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get model details',
				action: 'Get a model',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List available AI models',
				action: 'List models',
			},
		],
		default: 'getMany',
	},
];

export const aiModelFields: INodeProperties[] = [
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
				resource: ['model'],
			},
		},
	},

	// ===========================================
	//         Model Name (for get)
	// ===========================================
	{
		displayName: 'Model Name',
		name: 'modelName',
		type: 'string',
		required: true,
		default: '',
		placeholder: '@cf/meta/llama-3-8b-instruct',
		description: 'Name of the AI model',
		displayOptions: {
			show: {
				resource: ['model'],
				operation: ['get'],
			},
		},
	},

	// ===========================================
	//         Get Many filters
	// ===========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['model'],
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
				resource: ['model'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'modelFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['model'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Task',
				name: 'task',
				type: 'options',
				options: [
					{ name: 'All Tasks', value: '' },
					{ name: 'Text Generation', value: 'text-generation' },
					{ name: 'Text Embeddings', value: 'text-embeddings' },
					{ name: 'Text Classification', value: 'text-classification' },
					{ name: 'Image Classification', value: 'image-classification' },
					{ name: 'Image to Text', value: 'image-to-text' },
					{ name: 'Object Detection', value: 'object-detection' },
					{ name: 'Speech Recognition', value: 'speech-recognition' },
					{ name: 'Text to Image', value: 'text-to-image' },
					{ name: 'Translation', value: 'translation' },
					{ name: 'Summarization', value: 'summarization' },
				],
				default: '',
				description: 'Filter by model task type',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search models by name',
			},
		],
	},
];
