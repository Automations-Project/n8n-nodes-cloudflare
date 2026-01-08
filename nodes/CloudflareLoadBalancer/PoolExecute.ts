import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function poolExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'delete') {
		const poolId = this.getNodeParameter('poolId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/load_balancers/pools/${poolId}`,
		);
		return [{ json: { success: true, poolId } }];
	}

	if (operation === 'get') {
		const poolId = this.getNodeParameter('poolId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/load_balancers/pools/${poolId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/load_balancers/pools`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/load_balancers/pools`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const originsJson = this.getNodeParameter('origins', index) as string;
		const createOptions = this.getNodeParameter('createOptions', index) as {
			description?: string;
			enabled?: boolean;
			monitor?: string;
		};

		let origins: IDataObject[];
		try {
			origins = JSON.parse(originsJson);
		} catch {
			origins = [];
		}

		const body: IDataObject = {
			name,
			origins,
		};

		if (createOptions.description) {
			body.description = createOptions.description;
		}
		if (createOptions.enabled !== undefined) {
			body.enabled = createOptions.enabled;
		}
		if (createOptions.monitor) {
			body.monitor = createOptions.monitor;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/load_balancers/pools`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const poolId = this.getNodeParameter('poolId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as {
			description?: string;
			enabled?: boolean;
			monitor?: string;
			origins?: string;
		};

		const body: IDataObject = {};

		if (updateFields.description) {
			body.description = updateFields.description;
		}
		if (updateFields.enabled !== undefined) {
			body.enabled = updateFields.enabled;
		}
		if (updateFields.monitor) {
			body.monitor = updateFields.monitor;
		}
		if (updateFields.origins) {
			try {
				body.origins = JSON.parse(updateFields.origins);
			} catch {
				// Invalid JSON, skip
			}
		}

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/accounts/${accountId}/load_balancers/pools/${poolId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

