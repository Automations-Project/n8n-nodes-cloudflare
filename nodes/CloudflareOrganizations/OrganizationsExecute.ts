import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function organizationsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', '/user/organizations');
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const organizationId = this.getNodeParameter('organizationId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/user/organizations/${organizationId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'leave') {
		const organizationId = this.getNodeParameter('organizationId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/user/organizations/${organizationId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
