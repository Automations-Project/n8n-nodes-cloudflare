import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function monitorExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'delete') {
		const monitorId = this.getNodeParameter('monitorId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/load_balancers/monitors/${monitorId}`,
		);
		return [{ json: { success: true, monitorId } }];
	}

	if (operation === 'get') {
		const monitorId = this.getNodeParameter('monitorId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/load_balancers/monitors/${monitorId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/load_balancers/monitors`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/load_balancers/monitors`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'create') {
		const expectedCodes = this.getNodeParameter('expectedCodes', index) as string;
		const createOptions = this.getNodeParameter('createOptions', index) as {
			type?: string;
			description?: string;
			interval?: number;
			timeout?: number;
			retries?: number;
		};

		const body: IDataObject = {
			expected_codes: expectedCodes,
		};

		if (createOptions.type) {
			body.type = createOptions.type;
		}
		if (createOptions.description) {
			body.description = createOptions.description;
		}
		if (createOptions.interval) {
			body.interval = createOptions.interval;
		}
		if (createOptions.timeout) {
			body.timeout = createOptions.timeout;
		}
		if (createOptions.retries) {
			body.retries = createOptions.retries;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/load_balancers/monitors`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const monitorId = this.getNodeParameter('monitorId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as {
			expectedCodes?: string;
			description?: string;
			interval?: number;
			timeout?: number;
		};

		const body: IDataObject = {};

		if (updateFields.expectedCodes) {
			body.expected_codes = updateFields.expectedCodes;
		}
		if (updateFields.description) {
			body.description = updateFields.description;
		}
		if (updateFields.interval) {
			body.interval = updateFields.interval;
		}
		if (updateFields.timeout) {
			body.timeout = updateFields.timeout;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/accounts/${accountId}/load_balancers/monitors/${monitorId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

