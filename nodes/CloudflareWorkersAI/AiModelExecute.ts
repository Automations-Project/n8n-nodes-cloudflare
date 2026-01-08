import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function aiModelExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const filters = this.getNodeParameter('modelFilters', itemIndex) as {
			task?: string;
			search?: string;
		};

		const qs: IDataObject = {};

		if (filters.task) {
			qs.task = filters.task;
		}
		if (filters.search) {
			qs.search = filters.search;
		}

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/ai/models/search`,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			qs.per_page = limit;
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/ai/models/search`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const modelName = this.getNodeParameter('modelName', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/ai/models/schema`,
			{},
			{ model: modelName },
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
