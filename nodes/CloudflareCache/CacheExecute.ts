import { IExecuteFunctions, IDataObject, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function cacheExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	// ===========================================
	//         Cache Resource
	// ===========================================
	if (resource === 'cache') {
		let body: IDataObject = {};

		if (operation === 'purgeAll') {
			body = { purge_everything: true };
		} else if (operation === 'purgeUrls') {
			const filesStr = this.getNodeParameter('files', index) as string;
			const files = filesStr.split(',').map((s) => s.trim()).filter(s => s);
			if (files.length === 0) {
				throw new NodeOperationError(this.getNode(), 'No URLs provided', { itemIndex: index });
			}
			body = { files };
		} else if (operation === 'purgeTags') {
			const tagsStr = this.getNodeParameter('tags', index) as string;
			const tags = tagsStr.split(',').map((s) => s.trim()).filter(s => s);
			if (tags.length === 0) {
				throw new NodeOperationError(this.getNode(), 'No tags provided', { itemIndex: index });
			}
			body = { tags };
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/purge_cache`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	// ===========================================
	//         Cache Reserve Resource
	// ===========================================
	if (resource === 'cacheReserve') {
		if (operation === 'clear') {
			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				`/zones/${zoneId}/cache/cache_reserve_clear`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'get') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/cache/cache_reserve`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'getStatus') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/cache/cache_reserve_clear`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'update') {
			const enabled = this.getNodeParameter('enabled', index) as boolean;
			const body = { value: enabled ? 'on' : 'off' };

			const response = await cloudflareApiRequest.call(
				this,
				'PATCH',
				`/zones/${zoneId}/cache/cache_reserve`,
				body,
			);
			return [{ json: response as IDataObject }];
		}
	}

	return [];
}
