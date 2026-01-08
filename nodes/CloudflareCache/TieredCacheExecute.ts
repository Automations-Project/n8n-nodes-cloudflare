import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function smartTieredCacheExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'delete') {
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/cache/tiered_cache_smart_topology_enable`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/cache/tiered_cache_smart_topology_enable`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const value = this.getNodeParameter('value', index) as string;
		const body = { value };

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/cache/tiered_cache_smart_topology_enable`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

export async function cacheVariantsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'delete') {
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/cache/variants`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/cache/variants`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const valueJson = this.getNodeParameter('valueJson', index) as string;
		const value = JSON.parse(valueJson);

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/cache/variants`,
			{ value },
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

export async function regionalTieredCacheExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/cache/regional_tiered_cache`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const value = this.getNodeParameter('value', index) as string;
		const body = { value };

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/cache/regional_tiered_cache`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
