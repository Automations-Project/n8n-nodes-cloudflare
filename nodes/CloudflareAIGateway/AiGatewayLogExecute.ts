import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function aiGatewayLogExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const gatewayId = this.getNodeParameter('gatewayId', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const logFilters = this.getNodeParameter('logFilters', itemIndex) as {
			startDate?: string;
			endDate?: string;
			success?: boolean;
			cached?: boolean;
			provider?: string;
			orderBy?: string;
		};

		const qs: IDataObject = {};

		if (logFilters.startDate) {
			qs.start_date = logFilters.startDate;
		}
		if (logFilters.endDate) {
			qs.end_date = logFilters.endDate;
		}
		if (logFilters.success !== undefined) {
			qs.success = logFilters.success;
		}
		if (logFilters.cached !== undefined) {
			qs.cached = logFilters.cached;
		}
		if (logFilters.provider) {
			qs.provider = logFilters.provider;
		}
		if (logFilters.orderBy) {
			qs.order_by = logFilters.orderBy;
		}

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/ai-gateway/gateways/${gatewayId}/logs`,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			qs.per_page = limit;
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/ai-gateway/gateways/${gatewayId}/logs`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const logId = this.getNodeParameter('logId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/ai-gateway/gateways/${gatewayId}/logs/${logId}`,
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
