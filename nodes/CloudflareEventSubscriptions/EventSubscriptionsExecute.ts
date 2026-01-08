import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function eventSubscriptionsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/event_subscriptions/subscriptions`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'get') {
		const subscriptionId = this.getNodeParameter('subscriptionId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/event_subscriptions/subscriptions/${subscriptionId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const webhookUrl = this.getNodeParameter('webhookUrl', index) as string;
		const eventTypes = this.getNodeParameter('eventTypes', index, '') as string;
		const body: IDataObject = { url: webhookUrl };
		if (eventTypes) body.event_types = eventTypes.split(',').map(e => e.trim());
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/event_subscriptions/subscriptions`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const subscriptionId = this.getNodeParameter('subscriptionId', index) as string;
		const webhookUrl = this.getNodeParameter('webhookUrl', index, '') as string;
		const eventTypes = this.getNodeParameter('eventTypes', index, '') as string;
		const body: IDataObject = {};
		if (webhookUrl) body.url = webhookUrl;
		if (eventTypes) body.event_types = eventTypes.split(',').map(e => e.trim());
		const response = await cloudflareApiRequest.call(this, 'PATCH', `/accounts/${accountId}/event_subscriptions/subscriptions/${subscriptionId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const subscriptionId = this.getNodeParameter('subscriptionId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/event_subscriptions/subscriptions/${subscriptionId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
