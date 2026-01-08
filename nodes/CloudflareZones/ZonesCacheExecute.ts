import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function zonesCacheExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const zoneId = this.getNodeParameter('zoneId', itemIndex) as string;

	let responseData: IDataObject | undefined;

	if (operation === 'purgeAll') {
		const body: IDataObject = {
			purge_everything: true,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/purge_cache`,
			body,
		);
	}

	if (operation === 'purgeUrls') {
		const urlsStr = this.getNodeParameter('urls', itemIndex) as string;
		const files = urlsStr.split(',').map((url) => url.trim());

		const body: IDataObject = {
			files,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/purge_cache`,
			body,
		);
	}

	if (operation === 'purgeTags') {
		const tagsStr = this.getNodeParameter('tags', itemIndex) as string;
		const tags = tagsStr.split(',').map((tag) => tag.trim());

		const body: IDataObject = {
			tags,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/purge_cache`,
			body,
		);
	}

	if (operation === 'purgePrefix') {
		const prefixesStr = this.getNodeParameter('prefixes', itemIndex) as string;
		const prefixes = prefixesStr.split(',').map((prefix) => prefix.trim());

		const body: IDataObject = {
			prefixes,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/purge_cache`,
			body,
		);
	}

	// Normalize response
	const result: IDataObject[] = responseData
		? [responseData]
		: [{ success: true }];

	return result.map((item) => ({
		json: item,
		pairedItem: { item: itemIndex },
	}));
}
