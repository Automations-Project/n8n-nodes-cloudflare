import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function vectorizeIndexExecute(
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
				`/accounts/${accountId}/vectorize/v2/indexes`,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			const qs: IDataObject = { per_page: limit };
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/vectorize/v2/indexes`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const indexName = this.getNodeParameter('indexName', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/vectorize/v2/indexes/${indexName}`,
		);
	}

	if (operation === 'create') {
		const indexName = this.getNodeParameter('indexName', itemIndex) as string;
		const dimensions = this.getNodeParameter('dimensions', itemIndex) as number;
		const metric = this.getNodeParameter('metric', itemIndex) as string;
		const indexOptions = this.getNodeParameter('indexOptions', itemIndex) as {
			description?: string;
		};

		const body: IDataObject = {
			name: indexName,
			config: {
				dimensions,
				metric,
			},
		};

		if (indexOptions.description) {
			body.description = indexOptions.description;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/vectorize/v2/indexes`,
			body,
		);
	}

	if (operation === 'delete') {
		const indexName = this.getNodeParameter('indexName', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/vectorize/v2/indexes/${indexName}`,
		);

		responseData = { success: true, deleted: indexName };
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
