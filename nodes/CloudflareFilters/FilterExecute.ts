import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function filterExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const expression = this.getNodeParameter('expression', index) as string;
		const createOptions = this.getNodeParameter('createOptions', index) as IDataObject;

		// Cloudflare expects an array of filter objects
		const filters = [{
			expression,
			...createOptions,
		}];

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/filters`,
			filters as unknown as IDataObject,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'delete') {
		const filterId = this.getNodeParameter('filterId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/filters/${filterId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const filterId = this.getNodeParameter('filterId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/filters/${filterId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/filters`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/filters`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'update') {
		const filterId = this.getNodeParameter('filterId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = {
			id: filterId,
			...updateFields,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/filters/${filterId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
