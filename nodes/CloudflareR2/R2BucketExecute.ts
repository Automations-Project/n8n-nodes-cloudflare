import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function r2BucketExecute(
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
				`/accounts/${accountId}/r2/buckets`,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			const qs: IDataObject = { per_page: limit };
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/r2/buckets`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const bucketName = this.getNodeParameter('bucketName', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/r2/buckets/${bucketName}`,
		);
	}

	if (operation === 'create') {
		const bucketName = this.getNodeParameter('bucketName', itemIndex) as string;
		const bucketOptions = this.getNodeParameter('bucketOptions', itemIndex) as {
			locationHint?: string;
			storageClass?: string;
		};

		const body: IDataObject = {
			name: bucketName,
		};

		if (bucketOptions.locationHint) {
			body.locationHint = bucketOptions.locationHint;
		}
		if (bucketOptions.storageClass) {
			body.storageClass = bucketOptions.storageClass;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/r2/buckets`,
			body,
		);
	}

	if (operation === 'delete') {
		const bucketName = this.getNodeParameter('bucketName', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/r2/buckets/${bucketName}`,
		);

		responseData = { success: true, deleted: bucketName };
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
