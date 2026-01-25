import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestNdjson } from '../shared/GenericFunctions';
import { randomUUID } from 'crypto';


export async function vectorizeRagExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const indexName = this.getNodeParameter('indexName', itemIndex) as string;
	const embeddingModel = this.getNodeParameter('embeddingModel', itemIndex) as string;

	let responseData: IDataObject | undefined;

	if (operation === 'insertDocuments') {
		const useInputData = this.getNodeParameter('useInputData', itemIndex, true) as boolean;
		const storeOriginalText = this.getNodeParameter('storeOriginalText', itemIndex, true) as boolean;

		let documents: Array<{ id: string; text: string; metadata: IDataObject }> = [];

		if (useInputData) {
			// Use input data
			const items = this.getInputData();
			const textField = this.getNodeParameter('textField', itemIndex, 'text') as string;
			const idField = this.getNodeParameter('idField', itemIndex, 'id') as string;

			for (let i = 0; i < items.length; i++) {
				const item = items[i].json;
				const text = (item[textField] as string) || '';
				const id = (item[idField] as string) || randomUUID();

				// Collect all other fields as metadata
				const metadata: IDataObject = {};
				for (const key of Object.keys(item)) {
					if (key !== textField && key !== idField) {
						metadata[key] = item[key];
					}
				}

				if (text) {
					documents.push({ id, text, metadata });
				}
			}
		} else {
			// Use manual document entry
			const documentsParam = this.getNodeParameter('documents', itemIndex) as {
				documentValues: Array<{ id: string; text: string; metadata: string }>;
			};

			documents = documentsParam.documentValues.map((doc) => ({
				id: doc.id || randomUUID(),
				text: doc.text,
				metadata: doc.metadata ? JSON.parse(doc.metadata) : {},
			}));
		}

		if (documents.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'No documents to insert. Provide documents or input data with text.',
				{ itemIndex },
			);
		}

		// Generate embeddings for all documents
		const texts = documents.map((doc) => doc.text);
		const embeddingResponse = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/ai/run/${embeddingModel}`,
			{ text: texts },
		);

		const embeddings = embeddingResponse.data as number[][];

		if (!embeddings || embeddings.length !== documents.length) {
			throw new NodeOperationError(
				this.getNode(),
				`Embedding generation failed. Expected ${documents.length} embeddings, got ${embeddings?.length || 0}`,
				{ itemIndex },
			);
		}

		// Prepare vectors for upsert
		const vectors = documents.map((doc, idx) => {
			const metadata: IDataObject = { ...doc.metadata };
			if (storeOriginalText) {
				metadata.text = doc.text;
			}
			return {
				id: doc.id,
				values: embeddings[idx],
				metadata,
			};
		});

		// Upsert to Vectorize
		responseData = await cloudflareApiRequestNdjson.call(
			this,
			'POST',
			`/accounts/${accountId}/vectorize/v2/indexes/${indexName}/upsert`,
			vectors,
			itemIndex,
		);

		// Include document count in response
		responseData = {
			...responseData,
			documentsInserted: documents.length,
			embeddingModel,
		};
	}

	if (operation === 'searchDocuments') {
		const searchQuery = this.getNodeParameter('searchQuery', itemIndex) as string;
		const searchOptions = this.getNodeParameter('searchOptions', itemIndex, {}) as {
			topK?: number;
			filter?: string;
			minScore?: number;
		};

		// Generate embedding for query
		const embeddingResponse = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/ai/run/${embeddingModel}`,
			{ text: [searchQuery] },
		);


		const queryEmbedding = (embeddingResponse.data as number[][])?.[0];

		if (!queryEmbedding) {
			throw new NodeOperationError(
				this.getNode(),
				'Failed to generate embedding for search query',
				{ itemIndex },
			);
		}

		// Query Vectorize
		const body: IDataObject = {
			vector: queryEmbedding,
			topK: searchOptions.topK || 5,
			returnMetadata: 'all',
			returnValues: false,
		};

		if (searchOptions.filter) {
			try {
				body.filter = JSON.parse(searchOptions.filter);
			} catch {
				// Ignore invalid filter
			}
		}

		const queryResponse = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/vectorize/v2/indexes/${indexName}/query`,
			body,
		);

		// Process results - filter by minimum score and format
		let matches = (queryResponse.matches || []) as Array<{
			id: string;
			score: number;
			metadata?: IDataObject;
		}>;

		if (searchOptions.minScore && searchOptions.minScore > 0) {
			matches = matches.filter((match) => match.score >= searchOptions.minScore!);
		}

		responseData = {
			query: searchQuery,
			resultCount: matches.length,
			matches: matches.map((match) => ({
				id: match.id,
				score: match.score,
				text: match.metadata?.text || '',
				...match.metadata,
			})),
		};
	}

	// Normalize response
	const result: IDataObject[] = responseData ? [responseData] : [{ success: true }];

	return result.map((item) => ({
		json: item,
		pairedItem: { item: itemIndex },
	}));
}
