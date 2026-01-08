import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function schemaValidationExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'listSchemas') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/zones/${zoneId}/schema_validation/schemas`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getSchema') {
		const schemaId = this.getNodeParameter('schemaId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/schema_validation/schemas/${schemaId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createSchema') {
		const schemaSource = JSON.parse(this.getNodeParameter('schemaSource', index) as string);
		const body = { source: schemaSource };
		const response = await cloudflareApiRequest.call(this, 'POST', `/zones/${zoneId}/schema_validation/schemas`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteSchema') {
		const schemaId = this.getNodeParameter('schemaId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/zones/${zoneId}/schema_validation/schemas/${schemaId}`);
		return [{ json: { success: true } }];
	}

	if (operation === 'getSettings') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/schema_validation/settings`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateSettings') {
		const validationEnabled = this.getNodeParameter('validationEnabled', index) as boolean;
		const body = { validation_enabled: validationEnabled };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/schema_validation/settings`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
