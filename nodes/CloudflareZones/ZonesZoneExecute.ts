import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function zonesZoneExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const filters = this.getNodeParameter('zoneFilters', itemIndex) as {
			name?: string;
			accountId?: string;
			status?: string;
		};

		const qs: IDataObject = {};

		if (filters.name) {
			qs.name = filters.name;
		}
		if (filters.accountId) {
			qs['account.id'] = filters.accountId;
		}
		if (filters.status) {
			qs.status = filters.status;
		}

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				'/zones',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			qs.per_page = limit;
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				'/zones',
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const zoneId = this.getNodeParameter('zoneId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}`,
		);
	}

	if (operation === 'create') {
		const domainName = this.getNodeParameter('domainName', itemIndex) as string;
		const accountId = this.getNodeParameter('accountId', itemIndex) as string;
		const zoneOptions = this.getNodeParameter('zoneOptions', itemIndex) as {
			type?: string;
			jumpStart?: boolean;
		};

		const body: IDataObject = {
			name: domainName,
			account: { id: accountId },
		};

		if (zoneOptions.type) {
			body.type = zoneOptions.type;
		}
		if (zoneOptions.jumpStart !== undefined) {
			body.jump_start = zoneOptions.jumpStart;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			'/zones',
			body,
		);
	}

	if (operation === 'delete') {
		const zoneId = this.getNodeParameter('zoneId', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}`,
		);

		responseData = { success: true, deleted: zoneId };
	}

	if (operation === 'activationCheck') {
		const zoneId = this.getNodeParameter('zoneId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/activation_check`,
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
