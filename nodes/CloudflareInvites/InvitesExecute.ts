import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function invitesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', '/user/invites');
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const inviteId = this.getNodeParameter('inviteId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/user/invites/${inviteId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'accept') {
		const inviteId = this.getNodeParameter('inviteId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'PATCH', `/user/invites/${inviteId}`, { status: 'accepted' });
		return [{ json: response as IDataObject }];
	}

	return [];
}
