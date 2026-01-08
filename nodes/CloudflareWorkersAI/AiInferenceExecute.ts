import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function aiInferenceExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const modelName = this.getNodeParameter('modelName', itemIndex) as string;

	let responseData: IDataObject | undefined;

	if (operation === 'textGeneration') {
		const prompt = this.getNodeParameter('prompt', itemIndex) as string;
		const options = this.getNodeParameter('textGenOptions', itemIndex) as {
			maxTokens?: number;
			stream?: boolean;
			systemPrompt?: string;
			temperature?: number;
		};

		const messages: IDataObject[] = [];

		if (options.systemPrompt) {
			messages.push({ role: 'system', content: options.systemPrompt });
		}
		messages.push({ role: 'user', content: prompt });

		const body: IDataObject = {
			messages,
		};

		if (options.maxTokens) {
			body.max_tokens = options.maxTokens;
		}
		if (options.temperature !== undefined) {
			body.temperature = options.temperature;
		}
		if (options.stream) {
			body.stream = options.stream;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/ai/run/${modelName}`,
			body,
		);
	}

	if (operation === 'textEmbedding') {
		const text = this.getNodeParameter('embeddingText', itemIndex) as string;

		const body: IDataObject = {
			text: [text],
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/ai/run/${modelName}`,
			body,
		);
	}

	if (operation === 'imageClassification') {
		const imageUrl = this.getNodeParameter('imageUrl', itemIndex) as string;

		const body: IDataObject = {
			image: [imageUrl],
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/ai/run/${modelName}`,
			body,
		);
	}

	if (operation === 'textToImage') {
		const prompt = this.getNodeParameter('imagePrompt', itemIndex) as string;
		const options = this.getNodeParameter('imageGenOptions', itemIndex) as {
			guidance?: number;
			negativePrompt?: string;
			steps?: number;
		};

		const body: IDataObject = {
			prompt,
		};

		if (options.guidance) {
			body.guidance = options.guidance;
		}
		if (options.negativePrompt) {
			body.negative_prompt = options.negativePrompt;
		}
		if (options.steps) {
			body.num_steps = options.steps;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/ai/run/${modelName}`,
			body,
		);
	}

	if (operation === 'translation') {
		const text = this.getNodeParameter('translationText', itemIndex) as string;
		const sourceLanguage = this.getNodeParameter('sourceLanguage', itemIndex) as string;
		const targetLanguage = this.getNodeParameter('targetLanguage', itemIndex) as string;

		const body: IDataObject = {
			text,
			source_lang: sourceLanguage,
			target_lang: targetLanguage,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/ai/run/${modelName}`,
			body,
		);
	}

	// Normalize response
	const result: IDataObject[] = responseData
		? [responseData]
		: [{ success: true }];

	return result.map((item) => ({
		json: item,
		pairedItem: { item: itemIndex },
	}));
}
