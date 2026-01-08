import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function kvKeyExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const namespaceId = this.getNodeParameter('namespaceId', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const filters = this.getNodeParameter('keyFilters', itemIndex) as {
			prefix?: string;
		};

		const qs: IDataObject = {};

		if (filters.prefix) {
			qs.prefix = filters.prefix;
		}

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/keys`,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			qs.limit = limit;
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/keys`,
				{},
				qs,
			);
		}
	}

	if (operation === 'read') {
		const keyName = this.getNodeParameter('keyName', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(keyName)}`,
		);

		// The API returns the raw value, wrap it
		if (typeof responseData === 'string' || responseData === undefined) {
			responseData = { key: keyName, value: responseData };
		}
	}

	if (operation === 'write') {
		const keyName = this.getNodeParameter('keyName', itemIndex) as string;
		const value = this.getNodeParameter('value', itemIndex) as string;
		const writeOptions = this.getNodeParameter('writeOptions', itemIndex) as {
			expiration_ttl?: number;
			metadata?: string;
		};

		const qs: IDataObject = {};

		if (writeOptions.expiration_ttl && writeOptions.expiration_ttl > 0) {
			qs.expiration_ttl = writeOptions.expiration_ttl;
		}

		// For simple write, we send value as the body
		await cloudflareApiRequest.call(
			this,
			'PUT',
			`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(keyName)}`,
			{ value },
			qs,
		);

		responseData = { success: true, key: keyName };
	}

	if (operation === 'delete') {
		const keyName = this.getNodeParameter('keyName', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(keyName)}`,
		);

		responseData = { success: true, deleted: keyName };
	}

	if (operation === 'writeMany') {
		const kvPairsJson = this.getNodeParameter('kvPairs', itemIndex) as string;

		let kvPairs: Array<{ key: string; value: string }>;
		try {
			kvPairs = JSON.parse(kvPairsJson);
		} catch {
			throw new Error('Invalid JSON for key-value pairs');
		}

		const body: IDataObject = { data: kvPairs };

		await cloudflareApiRequest.call(
			this,
			'PUT',
			`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/bulk`,
			body,
		);

		responseData = { success: true, written: kvPairs.length };
	}

	if (operation === 'deleteMany') {
		const keysToDeleteStr = this.getNodeParameter('keysToDelete', itemIndex) as string;
		const keysToDelete = keysToDeleteStr.split(',').map((k) => k.trim());

		const body: IDataObject = { keys: keysToDelete };

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/bulk`,
			body,
		);

		responseData = { success: true, deleted: keysToDelete.length };
	}

	// Normalize response
	const result: IDataObject[] = Array.isArray(responseData)
		? responseData
		: responseData
			? [responseData]
			: [{ success: true }];

	return result.map((item) => ({
		json: item,
		pairedItem: { item: itemIndex },
	}));
}
