import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function argoExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	// ===========================================
	//         Smart Routing Resource
	// ===========================================
	if (resource === 'smartRouting') {
		if (operation === 'get') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/argo/smart_routing`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'update') {
			const value = this.getNodeParameter('smartRoutingValue', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'PATCH',
				`/zones/${zoneId}/argo/smart_routing`,
				{ value },
			);
			return [{ json: response as IDataObject }];
		}
	}

	// ===========================================
	//         Tiered Caching Resource
	// ===========================================
	if (resource === 'tieredCaching') {
		if (operation === 'get') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/argo/tiered_caching`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'update') {
			const value = this.getNodeParameter('tieredCachingValue', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'PATCH',
				`/zones/${zoneId}/argo/tiered_caching`,
				{ value },
			);
			return [{ json: response as IDataObject }];
		}
	}

	return [];
}
