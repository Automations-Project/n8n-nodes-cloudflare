import { IExecuteFunctions, IDataObject, INodeExecutionData, JsonObject, NodeApiError } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function imageExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'delete') {
		const imageId = this.getNodeParameter('imageId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/images/v1/${imageId}`,
		);
		return [{ json: { success: true, imageId } }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/images/v1`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/images/v1`,
				{},
				{ per_page: limit },
			);
			// Cloudflare Images API might return { result: { images: [...] } } or just { result: [...] }
			// Validating response structure would be good, but assuming standard for now.
			// Let's check generic function: it returns response.result.
			// If result is { images: [...] }, we should return that array.
			const result = response as IDataObject;
			if (result.images && Array.isArray(result.images)) {
				return this.helpers.returnJsonArray(result.images as IDataObject[]);
			}
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'upload') {
		const url = this.getNodeParameter('url', index) as string;

		// Use native httpRequestWithAuthentication to handle form-data manually or use generic options if I adapt it.
		// For now, direct call is safest for multipart.
		const options = {
			method: 'POST' as const,
			url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
			formData: {
				url,
			},
			json: true,
		};

		try {
			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'cloudflareApi',
				options,
			);

			if (response.success === false) {
				throw new NodeApiError(this.getNode(), response as JsonObject, {
					message: response.errors?.[0]?.message || 'Unknown error',
				});
			}

			return [{ json: response.result as IDataObject }];
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}

	if (operation === 'get') {
		const imageId = this.getNodeParameter('imageId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/images/v1/${imageId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const imageId = this.getNodeParameter('imageId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as {
			requireSignedURLs?: boolean;
			metadata?: string;
		};

		const body: IDataObject = {};

		if (updateFields.requireSignedURLs !== undefined) {
			body.requireSignedURLs = updateFields.requireSignedURLs;
		}
		if (updateFields.metadata) {
			try {
				body.metadata = JSON.parse(updateFields.metadata);
			} catch {
				body.metadata = {};
			}
		}

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/accounts/${accountId}/images/v1/${imageId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getStats') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/images/v1/stats`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getBlob') {
		const imageId = this.getNodeParameter('imageId', index) as string;

		// Get the blob as binary data
		const options = {
			method: 'GET' as const,
			url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}/blob`,
			encoding: null as unknown as undefined,
			resolveWithFullResponse: true,
		};

		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'cloudflareApi',
			options,
		);

		const binaryData = await this.helpers.prepareBinaryData(
			Buffer.from(response.body as Buffer),
			`image_${imageId}`,
		);

		return [{
			json: { imageId },
			binary: { data: binaryData },
		}];
	}

	return [];
}

