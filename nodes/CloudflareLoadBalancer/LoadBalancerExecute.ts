import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function loadBalancerExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'delete') {
		const loadBalancerId = this.getNodeParameter('loadBalancerId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/load_balancers/${loadBalancerId}`,
		);
		return [{ json: { success: true, loadBalancerId } }];
	}

	if (operation === 'get') {
		const loadBalancerId = this.getNodeParameter('loadBalancerId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/load_balancers/${loadBalancerId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/load_balancers`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/load_balancers`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const defaultPools = this.getNodeParameter('defaultPools', index) as string;
		const fallbackPool = this.getNodeParameter('fallbackPool', index) as string;
		const createOptions = this.getNodeParameter('createOptions', index) as {
			proxied?: boolean;
			ttl?: number;
			sessionAffinity?: string;
		};

		const body: IDataObject = {
			name,
			default_pools: defaultPools.split(',').map((p) => p.trim()),
			fallback_pool: fallbackPool,
		};

		if (createOptions.proxied !== undefined) {
			body.proxied = createOptions.proxied;
		}
		if (createOptions.ttl) {
			body.ttl = createOptions.ttl;
		}
		if (createOptions.sessionAffinity) {
			body.session_affinity = createOptions.sessionAffinity;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/load_balancers`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const loadBalancerId = this.getNodeParameter('loadBalancerId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as {
			defaultPools?: string;
			fallbackPool?: string;
			proxied?: boolean;
			enabled?: boolean;
		};

		const body: IDataObject = {};

		if (updateFields.defaultPools) {
			body.default_pools = updateFields.defaultPools.split(',').map((p) => p.trim());
		}
		if (updateFields.fallbackPool) {
			body.fallback_pool = updateFields.fallbackPool;
		}
		if (updateFields.proxied !== undefined) {
			body.proxied = updateFields.proxied;
		}
		if (updateFields.enabled !== undefined) {
			body.enabled = updateFields.enabled;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/load_balancers/${loadBalancerId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

