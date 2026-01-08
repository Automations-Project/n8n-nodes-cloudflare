import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function healthchecksExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const address = this.getNodeParameter('address', index) as string;
		const type = this.getNodeParameter('type', index) as string;
		const createOptions = this.getNodeParameter('createOptions', index) as IDataObject;

		const body: IDataObject = {
			name,
			address,
			type,
		};

		// Add optional fields
		Object.assign(body, createOptions);

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/healthchecks`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const healthcheckId = this.getNodeParameter('healthcheckId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/healthchecks/${healthcheckId}`,
		);
		return [{ json: { success: true, healthcheckId } }];
	}

	if (operation === 'get') {
		const healthcheckId = this.getNodeParameter('healthcheckId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/healthchecks/${healthcheckId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/healthchecks`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/healthchecks`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'update') {
		const healthcheckId = this.getNodeParameter('healthcheckId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = { ...updateFields };

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/healthchecks/${healthcheckId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
