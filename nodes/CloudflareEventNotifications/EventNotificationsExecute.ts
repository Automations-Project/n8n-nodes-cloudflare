import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function eventNotificationsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getTypes') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/alerting/v3/available_alerts`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'listDestinations') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/alerting/v3/destinations/webhooks`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'createDestination') {
		const destinationName = this.getNodeParameter('destinationName', index) as string;
		const webhookUrl = this.getNodeParameter('webhookUrl', index) as string;
		const body = { name: destinationName, url: webhookUrl };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/alerting/v3/destinations/webhooks`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteDestination') {
		const destinationId = this.getNodeParameter('destinationId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/alerting/v3/destinations/webhooks/${destinationId}`);
		return [{ json: { success: true } }];
	}

	if (operation === 'listPolicies') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/alerting/v3/policies`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'createPolicy') {
		const policyName = this.getNodeParameter('policyName', index) as string;
		const alertType = this.getNodeParameter('alertType', index) as string;
		const body = { name: policyName, alert_type: alertType, enabled: true, mechanisms: {} };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/alerting/v3/policies`, body);
		return [{ json: response as IDataObject }];
	}

	// R2 Event Notifications
	if (operation === 'getR2Config') {
		const bucketName = this.getNodeParameter('bucketName', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/event_notifications/r2/${bucketName}/configuration`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createR2Queue') {
		const bucketName = this.getNodeParameter('bucketName', index) as string;
		const queueId = this.getNodeParameter('queueId', index) as string;
		const body = { rules: [{ actions: ['PutObject', 'DeleteObject', 'CompleteMultipartUpload'] }] };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/event_notifications/r2/${bucketName}/configuration/queues/${queueId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteR2Queue') {
		const bucketName = this.getNodeParameter('bucketName', index) as string;
		const queueId = this.getNodeParameter('queueId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/event_notifications/r2/${bucketName}/configuration/queues/${queueId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
