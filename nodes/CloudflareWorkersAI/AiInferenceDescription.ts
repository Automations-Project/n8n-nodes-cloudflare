import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const aiInferenceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['inference'],
			},
		},
		options: [
			{
				name: 'Run Text Generation',
				value: 'textGeneration',
				description: 'Run text generation (LLM) inference',
				action: 'Run text generation',
			},
			{
				name: 'Run Text Embedding',
				value: 'textEmbedding',
				description: 'Generate text embeddings',
				action: 'Run text embedding',
			},
			{
				name: 'Run Image Classification',
				value: 'imageClassification',
				description: 'Classify an image',
				action: 'Run image classification',
			},
			{
				name: 'Run Text to Image',
				value: 'textToImage',
				description: 'Generate an image from text',
				action: 'Run text to image',
			},
			{
				name: 'Run Translation',
				value: 'translation',
				description: 'Translate text between languages',
				action: 'Run translation',
			},
		],
		default: 'textGeneration',
	},
];

export const aiInferenceFields: INodeProperties[] = [
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
				resource: ['inference'],
			},
		},
	},

	// ===========================================
	//         Model Name
	// ===========================================
	{
		displayName: 'Model',
		name: 'modelName',
		type: 'string',
		required: true,
		default: '@cf/meta/llama-3-8b-instruct',
		description: 'AI model to use for inference',
		displayOptions: {
			show: {
				resource: ['inference'],
			},
		},
	},

	// ===========================================
	//         Text Generation fields
	// ===========================================
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		placeholder: 'Write a short story about...',
		description: 'The prompt for text generation',
		displayOptions: {
			show: {
				resource: ['inference'],
				operation: ['textGeneration'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'textGenOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['inference'],
				operation: ['textGeneration'],
			},
		},
		options: [
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				default: 256,
				description: 'Maximum number of tokens to generate',
			},
			{
				displayName: 'Stream',
				name: 'stream',
				type: 'boolean',
				default: false,
				description: 'Whether to stream the response',
			},
			{
				displayName: 'System Prompt',
				name: 'systemPrompt',
				type: 'string',
				typeOptions: {
					rows: 2,
				},
				default: '',
				description: 'System prompt to set context',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				default: 0.7,
				typeOptions: {
					minValue: 0,
					maxValue: 2,
				},
				description: 'Sampling temperature (0-2)',
			},
		],
	},

	// ===========================================
	//         Text Embedding fields
	// ===========================================
	{
		displayName: 'Text',
		name: 'embeddingText',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		description: 'Text to generate embeddings for',
		displayOptions: {
			show: {
				resource: ['inference'],
				operation: ['textEmbedding'],
			},
		},
	},

	// ===========================================
	//         Image Classification fields
	// ===========================================
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/image.jpg',
		description: 'URL of the image to classify',
		displayOptions: {
			show: {
				resource: ['inference'],
				operation: ['imageClassification'],
			},
		},
	},

	// ===========================================
	//         Text to Image fields
	// ===========================================
	{
		displayName: 'Prompt',
		name: 'imagePrompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		placeholder: 'A beautiful sunset over mountains...',
		description: 'Text description of the image to generate',
		displayOptions: {
			show: {
				resource: ['inference'],
				operation: ['textToImage'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'imageGenOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['inference'],
				operation: ['textToImage'],
			},
		},
		options: [
			{
				displayName: 'Guidance Scale',
				name: 'guidance',
				type: 'number',
				default: 7.5,
				description: 'How closely to follow the prompt',
			},
			{
				displayName: 'Negative Prompt',
				name: 'negativePrompt',
				type: 'string',
				default: '',
				description: 'What to avoid in the image',
			},
			{
				displayName: 'Steps',
				name: 'steps',
				type: 'number',
				default: 20,
				description: 'Number of diffusion steps',
			},
		],
	},

	// ===========================================
	//         Translation fields
	// ===========================================
	{
		displayName: 'Text',
		name: 'translationText',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		description: 'Text to translate',
		displayOptions: {
			show: {
				resource: ['inference'],
				operation: ['translation'],
			},
		},
	},
	{
		displayName: 'Source Language',
		name: 'sourceLanguage',
		type: 'string',
		required: true,
		default: 'en',
		placeholder: 'en',
		description: 'Source language code (e.g., en, es, fr)',
		displayOptions: {
			show: {
				resource: ['inference'],
				operation: ['translation'],
			},
		},
	},
	{
		displayName: 'Target Language',
		name: 'targetLanguage',
		type: 'string',
		required: true,
		default: 'es',
		placeholder: 'es',
		description: 'Target language code (e.g., en, es, fr)',
		displayOptions: {
			show: {
				resource: ['inference'],
				operation: ['translation'],
			},
		},
	},
];
