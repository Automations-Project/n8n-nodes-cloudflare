import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function apiGatewayExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getConfig') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/api_gateway/configuration`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateConfig') {
		const body = this.getNodeParameter('configJson', index, {}) as IDataObject;
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/api_gateway/configuration`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getDiscovery') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/api_gateway/discovery`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'listOperations') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/zones/${zoneId}/api_gateway/operations`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'createOperation') {
		const endpoint = this.getNodeParameter('endpoint', index) as string;
		const method = this.getNodeParameter('method', index) as string;
		const host = this.getNodeParameter('host', index) as string;
		const body = { endpoint, method, host };
		const response = await cloudflareApiRequest.call(this, 'POST', `/zones/${zoneId}/api_gateway/operations`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteOperation') {
		const operationId = this.getNodeParameter('operationId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'DELETE', `/zones/${zoneId}/api_gateway/operations/${operationId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getSchemaSettings') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/api_gateway/settings/schema_validation`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateSchemaSettings') {
		const validationEnabled = this.getNodeParameter('validationEnabled', index) as boolean;
		const body = { validation_enabled: validationEnabled };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/api_gateway/settings/schema_validation`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
