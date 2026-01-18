import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestNdjson } from '../shared/GenericFunctions';

export async function vectorizeVectorExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const indexName = this.getNodeParameter('indexName', itemIndex) as string;

	let responseData: IDataObject | undefined;

	if (operation === 'query') {
		const queryVectorStr = this.getNodeParameter('queryVector', itemIndex) as string;
		const queryOptions = this.getNodeParameter('queryOptions', itemIndex) as {
			topK?: number;
			filter?: string;
			returnMetadata?: boolean;
			returnValues?: boolean;
		};

		let queryVector: number[];
		try {
			queryVector = JSON.parse(queryVectorStr);
		} catch {
			throw new Error('Query Vector must be a valid JSON array of numbers');
		}

		const body: IDataObject = {
			vector: queryVector,
		};

		if (queryOptions.topK) {
			body.topK = queryOptions.topK;
		}
		if (queryOptions.filter) {
			try {
				body.filter = JSON.parse(queryOptions.filter);
			} catch {
				// Ignore invalid filter
			}
		}
		if (queryOptions.returnMetadata !== undefined) {
			body.returnMetadata = queryOptions.returnMetadata;
		}
		if (queryOptions.returnValues !== undefined) {
			body.returnValues = queryOptions.returnValues;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/vectorize/v2/indexes/${indexName}/query`,
			body,
		);
	}

	if (operation === 'upsert') {
		const vectorsInput = this.getNodeParameter('vectors', itemIndex) as string | IDataObject[];

		// Parse vectors - accept both string (JSON) and array input
		let vectors: IDataObject[];
		if (typeof vectorsInput === 'string') {
			try {
				vectors = JSON.parse(vectorsInput);
			} catch {
				throw new NodeOperationError(
					this.getNode(),
					'Vectors must be a valid JSON array of vector objects',
					{ itemIndex },
				);
			}
		} else {
			vectors = vectorsInput;
		}

		// Validate that vectors is an array
		if (!Array.isArray(vectors)) {
			throw new NodeOperationError(
				this.getNode(),
				'Vectors must be an array of vector objects with id, values, and optional metadata',
				{ itemIndex },
			);
		}

		// Use NDJSON request helper for upsert (Cloudflare requires application/x-ndjson)
		responseData = await cloudflareApiRequestNdjson.call(
			this,
			'POST',
			`/accounts/${accountId}/vectorize/v2/indexes/${indexName}/upsert`,
			vectors,
			itemIndex,
		);
	}

	if (operation === 'get') {
		const vectorIdsStr = this.getNodeParameter('vectorIds', itemIndex) as string;
		const ids = vectorIdsStr.split(',').map((id) => id.trim());

		const body: IDataObject = {
			ids,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/vectorize/v2/indexes/${indexName}/get-by-ids`,
			body,
		);
	}

	if (operation === 'delete') {
		const vectorIdsStr = this.getNodeParameter('vectorIds', itemIndex) as string;
		const ids = vectorIdsStr.split(',').map((id) => id.trim());

		const body: IDataObject = {
			ids,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/vectorize/v2/indexes/${indexName}/delete-by-ids`,
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
