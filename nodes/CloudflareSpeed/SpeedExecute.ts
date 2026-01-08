import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function speedExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const url = this.getNodeParameter('url', index) as string;
		const testOptions = this.getNodeParameter('testOptions', index) as IDataObject;

		const body: IDataObject = {
			url,
		};

		Object.assign(body, testOptions);

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/speed_api/schedule/${encodeURIComponent(url)}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const testId = this.getNodeParameter('testId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/speed_api/pages/${testId}`,
		);
		return [{ json: { success: true, testId } }];
	}

	if (operation === 'get') {
		const testId = this.getNodeParameter('testId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/speed_api/pages/${testId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/speed_api/pages`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/speed_api/pages`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	return [];
}
