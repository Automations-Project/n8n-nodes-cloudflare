import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function durableObjectsObjectExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const namespaceId = this.getNodeParameter('namespaceId', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const objectFilters = this.getNodeParameter('objectFilters', itemIndex) as {
			cursor?: string;
		};

		const qs: IDataObject = {};

		if (objectFilters.cursor) {
			qs.cursor = objectFilters.cursor;
		}

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/workers/durable_objects/namespaces/${namespaceId}/objects`,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			qs.limit = limit;
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/workers/durable_objects/namespaces/${namespaceId}/objects`,
				{},
				qs,
			);
		}
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
