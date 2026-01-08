import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function magicCloudExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	// Cloud Connector Resource
	if (resource === 'cloudConnector') {
		const basePath = `/accounts/${accountId}/magic/cloud/connectors`;

		if (operation === 'getMany') {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		}
		if (operation === 'get') {
			const connectorId = this.getNodeParameter('connectorId', index) as string;
			const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${connectorId}`);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'create') {
			const connectorName = this.getNodeParameter('connectorName', index) as string;
			const cloudProvider = this.getNodeParameter('cloudProvider', index) as string;
			const body = { name: connectorName, cloud_provider: cloudProvider };
			const response = await cloudflareApiRequest.call(this, 'POST', basePath, body);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'delete') {
			const connectorId = this.getNodeParameter('connectorId', index) as string;
			await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${connectorId}`);
			return [{ json: { success: true } }];
		}
		if (operation === 'update') {
			const connectorId = this.getNodeParameter('connectorId', index) as string;
			const response = await cloudflareApiRequest.call(this, 'PATCH', `${basePath}/${connectorId}`, {});
			return [{ json: response as IDataObject }];
		}
	}

	// Integration Resource
	if (resource === 'integration') {
		const basePath = `/accounts/${accountId}/magic/cloud/integrations`;

		if (operation === 'getMany') {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		}
		if (operation === 'get') {
			const integrationId = this.getNodeParameter('integrationId', index) as string;
			const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${integrationId}`);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'create') {
			const response = await cloudflareApiRequest.call(this, 'POST', basePath, {});
			return [{ json: response as IDataObject }];
		}
		if (operation === 'delete') {
			const integrationId = this.getNodeParameter('integrationId', index) as string;
			await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${integrationId}`);
			return [{ json: { success: true } }];
		}
	}

	return [];
}
