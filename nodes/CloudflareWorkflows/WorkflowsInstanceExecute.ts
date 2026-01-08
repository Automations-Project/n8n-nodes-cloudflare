import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function workflowsInstanceExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const workflowName = this.getNodeParameter('workflowName', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const instanceFilters = this.getNodeParameter('instanceFilters', itemIndex) as {
			status?: string;
		};

		const qs: IDataObject = {};

		if (instanceFilters.status) {
			qs.status = instanceFilters.status;
		}

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/workflows/${workflowName}/instances`,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			qs.per_page = limit;
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/workflows/${workflowName}/instances`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const instanceId = this.getNodeParameter('instanceId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/workflows/${workflowName}/instances/${instanceId}`,
		);
	}

	if (operation === 'create') {
		const instanceParamsStr = this.getNodeParameter('instanceParams', itemIndex) as string;

		let params: IDataObject = {};
		try {
			params = JSON.parse(instanceParamsStr);
		} catch {
			// Use empty params if invalid JSON
		}

		const body: IDataObject = {
			params,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/workflows/${workflowName}/instances`,
			body,
		);
	}

	if (operation === 'terminate') {
		const instanceId = this.getNodeParameter('instanceId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/workflows/${workflowName}/instances/${instanceId}/terminate`,
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
