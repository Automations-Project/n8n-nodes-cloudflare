import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function membershipsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/memberships`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const membershipId = this.getNodeParameter('membershipId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/memberships/${membershipId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const membershipId = this.getNodeParameter('membershipId', index) as string;
		const status = this.getNodeParameter('status', index) as string;
		const body = { status };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/memberships/${membershipId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const membershipId = this.getNodeParameter('membershipId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/memberships/${membershipId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
