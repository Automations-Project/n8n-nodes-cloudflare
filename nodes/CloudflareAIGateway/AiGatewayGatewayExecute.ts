import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function aiGatewayGatewayExecute(
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
				`/accounts/${accountId}/ai-gateway/gateways`,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			const qs: IDataObject = { per_page: limit };
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/ai-gateway/gateways`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const gatewayId = this.getNodeParameter('gatewayId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/ai-gateway/gateways/${gatewayId}`,
		);
	}

	if (operation === 'create') {
		const gatewayName = this.getNodeParameter('gatewayName', itemIndex) as string;
		const gatewayOptions = this.getNodeParameter('gatewayOptions', itemIndex) as {
			collectLogs?: boolean;
			cacheTtl?: number;
			cacheInvalidateOnUpdate?: boolean;
			rateLimitingInterval?: number;
			rateLimitingLimit?: number;
			rateLimitingTechnique?: string;
		};

		const body: IDataObject = {
			id: gatewayName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
		};

		if (gatewayOptions.collectLogs !== undefined) {
			body.collect_logs = gatewayOptions.collectLogs;
		}
		if (gatewayOptions.cacheTtl) {
			body.cache_ttl = gatewayOptions.cacheTtl;
		}
		if (gatewayOptions.cacheInvalidateOnUpdate !== undefined) {
			body.cache_invalidate_on_update = gatewayOptions.cacheInvalidateOnUpdate;
		}
		if (gatewayOptions.rateLimitingInterval) {
			body.rate_limiting_interval = gatewayOptions.rateLimitingInterval;
		}
		if (gatewayOptions.rateLimitingLimit) {
			body.rate_limiting_limit = gatewayOptions.rateLimitingLimit;
		}
		if (gatewayOptions.rateLimitingTechnique) {
			body.rate_limiting_technique = gatewayOptions.rateLimitingTechnique;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/ai-gateway/gateways`,
			body,
		);
	}

	if (operation === 'update') {
		const gatewayId = this.getNodeParameter('gatewayId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex) as {
			collectLogs?: boolean;
			cacheTtl?: number;
			cacheInvalidateOnUpdate?: boolean;
			rateLimitingInterval?: number;
			rateLimitingLimit?: number;
		};

		const body: IDataObject = {};

		if (updateFields.collectLogs !== undefined) {
			body.collect_logs = updateFields.collectLogs;
		}
		if (updateFields.cacheTtl !== undefined) {
			body.cache_ttl = updateFields.cacheTtl;
		}
		if (updateFields.cacheInvalidateOnUpdate !== undefined) {
			body.cache_invalidate_on_update = updateFields.cacheInvalidateOnUpdate;
		}
		if (updateFields.rateLimitingInterval !== undefined) {
			body.rate_limiting_interval = updateFields.rateLimitingInterval;
		}
		if (updateFields.rateLimitingLimit !== undefined) {
			body.rate_limiting_limit = updateFields.rateLimitingLimit;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/accounts/${accountId}/ai-gateway/gateways/${gatewayId}`,
			body,
		);
	}

	if (operation === 'delete') {
		const gatewayId = this.getNodeParameter('gatewayId', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/ai-gateway/gateways/${gatewayId}`,
		);

		responseData = { success: true, deleted: gatewayId };
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
