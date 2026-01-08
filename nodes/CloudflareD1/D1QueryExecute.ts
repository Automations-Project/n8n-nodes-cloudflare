import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function d1QueryExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const databaseId = this.getNodeParameter('databaseId', itemIndex) as string;
	const sql = this.getNodeParameter('sql', itemIndex) as string;
	const queryOptions = this.getNodeParameter('queryOptions', itemIndex) as {
		returnMetadata?: boolean;
	};

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'execute') {
		const paramsStr = this.getNodeParameter('params', itemIndex) as string;

		let params: unknown[] = [];
		if (paramsStr && paramsStr.trim()) {
			try {
				params = JSON.parse(paramsStr);
			} catch {
				throw new Error('Invalid JSON for query parameters');
			}
		}

		const body: IDataObject = {
			sql,
		};

		if (params.length > 0) {
			body.params = params;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/d1/database/${databaseId}/query`,
			body,
		);
	}

	if (operation === 'executeRaw') {
		const body: IDataObject = {
			sql,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/d1/database/${databaseId}/raw`,
			body,
		);
	}

	// D1 query returns results in a specific format
	// Extract the actual results if structure is { results: [...], meta: {...} }
	let results: IDataObject[] = [];

	if (responseData) {
		if (Array.isArray(responseData)) {
			// If the response is an array of query results
			for (const queryResult of responseData) {
				if (queryResult.results && Array.isArray(queryResult.results)) {
					if (queryOptions.returnMetadata) {
						results.push({
							results: queryResult.results,
							meta: queryResult.meta,
						});
					} else {
						results.push(...(queryResult.results as IDataObject[]));
					}
				} else {
					results.push(queryResult);
				}
			}
		} else if ((responseData as IDataObject).results) {
			// Single query result
			if (queryOptions.returnMetadata) {
				results.push({
					results: (responseData as IDataObject).results,
					meta: (responseData as IDataObject).meta,
				});
			} else {
				const queryResults = (responseData as IDataObject).results;
				if (Array.isArray(queryResults)) {
					results = queryResults as IDataObject[];
				} else {
					results.push(responseData);
				}
			}
		} else {
			results.push(responseData);
		}
	}

	if (results.length === 0) {
		results.push({ success: true, rowsAffected: 0 });
	}

	return results.map((item) => ({
		json: item,
		pairedItem: { item: itemIndex },
	}));
}
