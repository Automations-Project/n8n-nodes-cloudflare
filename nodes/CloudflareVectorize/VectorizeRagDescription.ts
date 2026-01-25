import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const vectorizeRagOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['rag'],
			},
		},
		options: [
			{
				name: 'Insert Documents',
				value: 'insertDocuments',
				description: 'Generate embeddings from text and store in vector database',
				action: 'Insert documents',
			},
			{
				name: 'Search Documents',
				value: 'searchDocuments',
				description: 'Search for similar documents using natural language query',
				action: 'Search documents',
			},
		],
		default: 'searchDocuments',
	},
];

export const vectorizeRagFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['rag'],
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
				resource: ['rag'],
			},
		},
	},

	// ===========================================
	//         Embedding Model
	// ===========================================
	{
		displayName: 'Embedding Model',
		name: 'embeddingModel',
		type: 'options',
		options: [
			{
				name: 'BGE Base EN V1.5 (768 Dimensions)',
				value: '@cf/baai/bge-base-en-v1.5',
				description: 'General purpose English embeddings - 768 dimensions',
			},
			{
				name: 'BGE Small EN V1.5 (384 Dimensions)',
				value: '@cf/baai/bge-small-en-v1.5',
				description: 'Smaller, faster English embeddings - 384 dimensions',
			},
			{
				name: 'BGE Large EN V1.5 (1024 Dimensions)',
				value: '@cf/baai/bge-large-en-v1.5',
				description: 'Highest quality English embeddings - 1024 dimensions',
			},
		],
		default: '@cf/baai/bge-base-en-v1.5',
		description: 'Workers AI model for generating embeddings',
		displayOptions: {
			show: {
				resource: ['rag'],
			},
		},
	},

	// ===========================================
	//         Insert Documents fields
	// ===========================================
	{
		displayName: 'Documents',
		name: 'documents',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Document',
		default: { documentValues: [] },
		description: 'Documents to embed and store',
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['insertDocuments'],
			},
		},
		options: [
			{
				displayName: 'Document',
				name: 'documentValues',
				values: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						placeholder: 'doc-1',
						description: 'Unique identifier for this document',
					},
					{
						displayName: 'Text Content',
						name: 'text',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						placeholder: 'Enter the document text to embed...',
						description: 'The text content to generate embeddings for',
					},
					{
						displayName: 'Metadata (JSON)',
						name: 'metadata',
						type: 'json',
						default: '{}',
						description: 'Optional metadata to store with the vector',
					},
				],
			},
		],
	},

	{
		displayName: 'Text Field',
		name: 'textField',
		type: 'string',
		default: 'text',
		placeholder: 'text',
		description: 'Field name in input data containing text to embed (for batch mode)',
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['insertDocuments'],
			},
		},
	},

	{
		displayName: 'Use Input Data',
		name: 'useInputData',
		type: 'boolean',
		default: true,
		description: 'Whether to use input data for documents instead of manual entry. When enabled, each input item will be processed as a document.',
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['insertDocuments'],
			},
		},
	},

	{
		displayName: 'ID Field',
		name: 'idField',
		type: 'string',
		default: 'id',
		placeholder: 'ID',
		description: 'Field name in input data containing document ID (auto-generated if not found)',
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['insertDocuments'],
				useInputData: [true],
			},
		},
	},

	{
		displayName: 'Store Original Text',
		name: 'storeOriginalText',
		type: 'boolean',
		default: true,
		description: 'Whether to store the original text in metadata for retrieval',
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['insertDocuments'],
			},
		},
	},

	// ===========================================
	//         Search Documents fields
	// ===========================================
	{
		displayName: 'Query',
		name: 'searchQuery',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		required: true,
		default: '',
		placeholder: 'What is the capital of France?',
		description: 'Natural language query to search for similar documents',
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['searchDocuments'],
			},
		},
	},

	{
		displayName: 'Options',
		name: 'searchOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['rag'],
				operation: ['searchDocuments'],
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
				displayName: 'Minimum Score',
				name: 'minScore',
				type: 'number',
				default: 0,
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					numberPrecision: 2,
				},
				description: 'Minimum similarity score threshold (0-1)',
			},
			{
				displayName: 'Top K',
				name: 'topK',
				type: 'number',
				default: 5,
				typeOptions: {
					minValue: 1,
					maxValue: 20,
				},
				description: 'Number of similar documents to return (1-20)',
			},
		],
	},
];
