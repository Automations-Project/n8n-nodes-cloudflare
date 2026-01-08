import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function kvNamespaceExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/storage/kv/namespaces`,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			const qs: IDataObject = { per_page: limit };
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/storage/kv/namespaces`,
				{},
				qs,
			);
		}
	}

	if (operation === 'create') {
		const title = this.getNodeParameter('title', itemIndex) as string;

		const body: IDataObject = {
			title,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/storage/kv/namespaces`,
			body,
		);
	}

	if (operation === 'delete') {
		const namespaceId = this.getNodeParameter('namespaceId', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}`,
		);

		responseData = { success: true, deleted: namespaceId };
	}

	if (operation === 'rename') {
		const namespaceId = this.getNodeParameter('namespaceId', itemIndex) as string;
		const title = this.getNodeParameter('title', itemIndex) as string;

		const body: IDataObject = {
			title,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}`,
			body,
		);
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
