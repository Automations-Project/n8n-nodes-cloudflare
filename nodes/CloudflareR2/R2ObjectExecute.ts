import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function r2ObjectExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const bucketName = this.getNodeParameter('bucketName', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const filters = this.getNodeParameter('objectFilters', itemIndex) as {
			prefix?: string;
			delimiter?: string;
		};

		const qs: IDataObject = {};

		if (filters.prefix) {
			qs.prefix = filters.prefix;
		}
		if (filters.delimiter) {
			qs.delimiter = filters.delimiter;
		}

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/r2/buckets/${bucketName}/objects`,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			qs.per_page = limit;
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/r2/buckets/${bucketName}/objects`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const objectKey = this.getNodeParameter('objectKey', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/r2/buckets/${bucketName}/objects/${encodeURIComponent(objectKey)}`,
		);
	}

	if (operation === 'delete') {
		const objectKey = this.getNodeParameter('objectKey', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/r2/buckets/${bucketName}/objects/${encodeURIComponent(objectKey)}`,
		);

		responseData = { success: true, deleted: objectKey };
	}

	if (operation === 'upload') {
		const objectKey = this.getNodeParameter('objectKey', itemIndex) as string;
		const contentSource = this.getNodeParameter('contentSource', itemIndex) as string;
		const uploadOptions = this.getNodeParameter('uploadOptions', itemIndex) as {
			contentType?: string;
			cacheControl?: string;
		};

		let content: string | Buffer;

		if (contentSource === 'text') {
			content = this.getNodeParameter('content', itemIndex) as string;
		} else {
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;
			content = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
		}

		// Note: R2 API for object upload may require S3-compatible endpoint
		// This is a simplified version using the Cloudflare API
		const body: IDataObject = {
			key: objectKey,
			body: content.toString('base64'),
		};

		if (uploadOptions.contentType) {
			body.contentType = uploadOptions.contentType;
		}
		if (uploadOptions.cacheControl) {
			body.cacheControl = uploadOptions.cacheControl;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/accounts/${accountId}/r2/buckets/${bucketName}/objects/${encodeURIComponent(objectKey)}`,
			body,
		);

		if (!responseData) {
			responseData = { success: true, key: objectKey };
		}
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
