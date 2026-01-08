import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function videoExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'delete') {
		const videoId = this.getNodeParameter('videoId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/stream/${videoId}`,
		);
		return [{ json: { success: true, videoId } }];
	}

	if (operation === 'get') {
		const videoId = this.getNodeParameter('videoId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/stream/${videoId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/stream`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/stream`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]); // response can be wrapped in result? Stream API returns result directly or wrapped?
			// Cloudflare API usually wraps in `result`. `cloudflareApiRequest` unwraps it.
			// But Stream API might be different?
			// Docs say: GET accounts/:id/stream returns { "result": [...], "success": true ... }
			// So generic function should work.
			// If array returned directly by generic function, handle it.
		}
	}

	if (operation === 'upload') {
		const url = this.getNodeParameter('url', index) as string;
		const body = {
			url,
		};
		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/stream/copy`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const videoId = this.getNodeParameter('videoId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as {
			requireSignedURLs?: boolean;
			allowedOrigins?: string;
			thumbnailTimestampPct?: number;
		};

		const body: IDataObject = {};

		if (updateFields.requireSignedURLs !== undefined) {
			body.requireSignedURLs = updateFields.requireSignedURLs;
		}
		if (updateFields.allowedOrigins) {
			body.allowedOrigins = updateFields.allowedOrigins.split(',').map((o) => o.trim());
		}
		if (updateFields.thumbnailTimestampPct !== undefined) {
			body.thumbnailTimestampPct = updateFields.thumbnailTimestampPct;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/stream/${videoId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getEmbed') {
		const videoId = this.getNodeParameter('videoId', index) as string;

		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/stream/${videoId}/embed`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getToken') {
		const videoId = this.getNodeParameter('videoId', index) as string;
		const tokenOptions = this.getNodeParameter('tokenOptions', index) as {
			exp?: number;
			downloadable?: boolean;
		};

		const body: IDataObject = {};

		if (tokenOptions.exp) {
			body.exp = Math.floor(Date.now() / 1000) + tokenOptions.exp;
		}
		if (tokenOptions.downloadable) {
			body.downloadable = true;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/stream/${videoId}/token`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

