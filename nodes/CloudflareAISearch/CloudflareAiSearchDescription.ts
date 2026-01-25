import { INodeProperties } from 'n8n-workflow';

export const aiSearchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ai_search'],
			},
		},
		options: [
			{
				name: 'Generate Answer (RAG)',
				value: 'generate',
				description: 'Generate an answer using RAG (Retrieval Augmented Generation)',
				action: 'Generate an answer using RAG',
			},
			{
				name: 'Search Files',
				value: 'search',
				description: 'Search for relevant files/content without generating an answer',
				action: 'Search files without generating',
			},
		],
		default: 'generate',
	},
];

export const aiSearchFields: INodeProperties[] = [
	// ----------------------------------------
	// Common fields for all operations
	// ----------------------------------------
	{
		displayName: 'Account Name or ID',
		name: 'accountId',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getAccounts',
		},
		displayOptions: {
			show: {
				resource: ['ai_search'],
			},
		},
		required: true,
	},
	{
		displayName: 'AI Search Instance Name or ID',
		name: 'ragName',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getAISearchInstances',
			loadOptionsDependsOn: ['accountId'],
		},
		hint: 'Select your AI Search (AutoRAG) application',
		displayOptions: {
			show: {
				resource: ['ai_search'],
			},
		},
		required: true,
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		placeholder: 'What is the return policy?',
		hint: 'The question or search query to send to AI Search',
		description: 'The input query to search or ask about',
		displayOptions: {
			show: {
				resource: ['ai_search'],
			},
		},
		required: true,
	},

	// ----------------------------------------
	// Generate operation specific fields
	// ----------------------------------------
	{
		displayName: 'Model',
		name: 'model',
		type: 'string',
		default: '',
		placeholder: '@cf/meta/llama-3.1-8b-instruct',
		hint: 'Leave empty to use the model configured in AI Search settings',
		description: 'The model to use for generation. Defaults to the one configured in the AI Search settings.',
		displayOptions: {
			show: {
				resource: ['ai_search'],
				operation: ['generate'],
			},
		},
	},
	{
		displayName: 'System Prompt',
		name: 'systemPrompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		placeholder: 'You are a helpful assistant that answers questions based on the provided context.',
		hint: 'Custom instructions for the AI model when generating responses',
		description: 'The system prompt to use for generation',
		displayOptions: {
			show: {
				resource: ['ai_search'],
				operation: ['generate'],
			},
		},
	},

	// ----------------------------------------
	// Options collection
	// ----------------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['ai_search'],
			},
		},
		options: [
			{
				displayName: 'Max Results',
				name: 'maxNumResults',
				type: 'number',
				default: 10,
				typeOptions: {
					minValue: 1,
					maxValue: 50,
				},
				hint: 'How many context chunks to retrieve (1-50)',
				description: 'Maximum number of context results to retrieve from the vector store',
			},
			{
				displayName: 'Reranking Enabled',
				name: 'rerankingEnabled',
				type: 'boolean',
				default: false,
				hint: 'Reorder results by semantic relevance using a reranking model',
				description: 'Whether to enable reranking of results for better relevance',
			},
			{
				displayName: 'Reranking Model',
				name: 'rerankingModel',
				type: 'string',
				default: '',
				placeholder: '@cf/baai/bge-reranker-base',
				description: 'Model to use for reranking if enabled',
				displayOptions: {
					show: {
						rerankingEnabled: [true],
					},
				},
			},
			{
				displayName: 'Rewrite Query',
				name: 'rewriteQuery',
				type: 'boolean',
				default: false,
				hint: 'Optimizes the query for better vector search results',
				description: 'Whether to rewrite the query for better search results',
			},
			{
				displayName: 'Score Threshold',
				name: 'scoreThreshold',
				type: 'number',
				default: 0,
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					numberPrecision: 2,
				},
				hint: 'Filter out results below this relevance score (0.0 to 1.0)',
				description: 'Minimum score for results to be included (0.0 to 1.0)',
			},
		],
	},

	// ----------------------------------------
	// Metadata filter
	// ----------------------------------------
	{
		displayName: 'Metadata Filter',
		name: 'filter',
		type: 'json',
		default: '',
		placeholder: '{"folder": "docs/"}',
		hint: 'Filter results based on document metadata',
		description: 'Filter results based on metadata. See <a href="https://developers.cloudflare.com/ai-search/configuration/metadata/">Cloudflare docs</a> for syntax.',
		displayOptions: {
			show: {
				resource: ['ai_search'],
			},
		},
	},
];
