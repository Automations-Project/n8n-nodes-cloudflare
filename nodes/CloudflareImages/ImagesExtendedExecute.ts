import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

// Keys Execute Handler
export async function imagesKeysExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const accountId = this.getNodeParameter('accountId', index) as string;
	const response = await cloudflareApiRequestAllItems.call(
		this,
		'GET',
		`/accounts/${accountId}/images/v1/keys`,
	);
	return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
}

// Variants Execute Handler
export async function imagesVariantsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const basePath = `/accounts/${accountId}/images/v1/variants`;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}
	if (operation === 'get') {
		const variantId = this.getNodeParameter('variantId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${variantId}`);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'create') {
		const variantName = this.getNodeParameter('variantName', index) as string;
		const fit = this.getNodeParameter('variantFit', index) as string;
		const width = this.getNodeParameter('variantWidth', index) as number;
		const height = this.getNodeParameter('variantHeight', index) as number;
		const body = { id: variantName, options: { fit, width, height, metadata: 'none' } };
		const response = await cloudflareApiRequest.call(this, 'POST', basePath, body);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'update') {
		const variantId = this.getNodeParameter('variantId', index) as string;
		const fit = this.getNodeParameter('variantFit', index) as string;
		const width = this.getNodeParameter('variantWidth', index) as number;
		const height = this.getNodeParameter('variantHeight', index) as number;
		const body = { options: { fit, width, height, metadata: 'none' } };
		const response = await cloudflareApiRequest.call(this, 'PATCH', `${basePath}/${variantId}`, body);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'delete') {
		const variantId = this.getNodeParameter('variantId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${variantId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
