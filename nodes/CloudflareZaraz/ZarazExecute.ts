import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function zarazExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	// ===========================================
	//         Config Resource
	// ===========================================
	if (resource === 'config') {
		if (operation === 'get') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/zaraz/config`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'update') {
			const configJson = this.getNodeParameter('configJson', index) as string;
			const config = JSON.parse(configJson);

			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/zones/${zoneId}/zaraz/config`,
				config,
			);
			return [{ json: response as IDataObject }];
		}
	}

	// ===========================================
	//         Tool Resource
	// ===========================================
	if (resource === 'tool') {
		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			// Get the config which contains the tools
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/zaraz/config`,
			);

			const tools = (response as { tools?: IDataObject }).tools || {};
			const toolsArray = Object.entries(tools).map(([key, value]) => ({
				id: key,
				...(value as IDataObject),
			}));

			if (returnAll) {
				return this.helpers.returnJsonArray(toolsArray);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				return this.helpers.returnJsonArray(toolsArray.slice(0, limit));
			}
		}
	}

	// ===========================================
	//         History Resource
	// ===========================================
	if (resource === 'history') {
		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					`/zones/${zoneId}/zaraz/history`,
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					`/zones/${zoneId}/zaraz/history`,
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}

		if (operation === 'publish') {
			const publishDescription = this.getNodeParameter('publishDescription', index) as string;

			const body: IDataObject = {};
			if (publishDescription) {
				body.description = publishDescription;
			}

			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				`/zones/${zoneId}/zaraz/publish`,
				body,
			);
			return [{ json: response as IDataObject }];
		}
	}

	return [];
}
