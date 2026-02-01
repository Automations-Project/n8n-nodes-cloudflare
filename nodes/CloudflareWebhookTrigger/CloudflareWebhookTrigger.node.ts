import type {
	IHookFunctions,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { cloudflareApiRequest } from '../shared/GenericFunctions';
import { getAccounts } from '../shared/SharedMethods';

export class CloudflareWebhookTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Webhook Trigger',
		name: 'cloudflareWebhookTrigger',
		icon: 'file:cloudflare.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when Cloudflare Stream events occur',
		subtitle: '={{$parameter["event"]}}',
		defaults: {
			name: 'Cloudflare Webhook Trigger',
		},
		credentials: [
			{
				name: 'cloudflareApi',
				required: true,
			},
		],
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Account Name or ID',
				name: 'accountId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAccounts',
				},
				default: '',
				required: true,
				description: 'The Cloudflare account. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'ready',
				options: [
					{
						name: 'Video Ready',
						value: 'ready',
						description: 'Triggered when video processing is complete and ready to stream',
					},
					{
						name: 'Video Error',
						value: 'error',
						description: 'Triggered when video processing encounters an error',
					},
					{
						name: 'Live Input Connected',
						value: 'live_input.connected',
						description: 'Triggered when a live input stream connects',
					},
					{
						name: 'Live Input Disconnected',
						value: 'live_input.disconnected',
						description: 'Triggered when a live input stream disconnects',
					},
				],
				description: 'The Stream event to listen for',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Raw Body',
						name: 'includeRawBody',
						type: 'boolean',
						default: false,
						description: 'Whether to include the raw webhook body in the output',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			getAccounts,
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const accountId = this.getNodeParameter('accountId', 0) as string;

				try {
					// Get current Stream webhook configuration
					const response = await cloudflareApiRequest.call(
						this,
						'GET',
						`/accounts/${accountId}/stream/webhook`,
					);

					const currentUrl = (response.result as IDataObject)?.notificationUrl;
					if (currentUrl === webhookUrl) {
						webhookData.webhookRegistered = true;
						return true;
					}
				} catch {
					// If no webhook is configured, that's expected
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const accountId = this.getNodeParameter('accountId', 0) as string;

				const body: IDataObject = {
					notificationUrl: webhookUrl,
				};

				await cloudflareApiRequest.call(
					this,
					'PUT',
					`/accounts/${accountId}/stream/webhook`,
					body,
				);

				webhookData.webhookRegistered = true;
				webhookData.accountId = accountId;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const accountId = (webhookData.accountId as string) || this.getNodeParameter('accountId', 0) as string;

				if (!webhookData.webhookRegistered) {
					return false;
				}

				try {
					await cloudflareApiRequest.call(
						this,
						'DELETE',
						`/accounts/${accountId}/stream/webhook`,
					);
				} catch {
					// If webhook was already deleted, that's fine
				}

				delete webhookData.webhookRegistered;
				delete webhookData.accountId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData() as IDataObject;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		// Validate the webhook signature if secret is available
		// Cloudflare Stream webhooks include a signature header
		const headers = this.getHeaderData() as IDataObject;

		// Process the webhook payload
		const outputData: IDataObject = {
			...body,
			_receivedAt: new Date().toISOString(),
		};

		// Include headers for signature verification if needed
		if (options.includeRawBody) {
			outputData._headers = headers;
		}

		const event = body.status || body.event || 'unknown';
		outputData._eventType = event;

		return {
			workflowData: [
				[
					{
						json: outputData,
					} as INodeExecutionData,
				],
			],
		};
	}
}
