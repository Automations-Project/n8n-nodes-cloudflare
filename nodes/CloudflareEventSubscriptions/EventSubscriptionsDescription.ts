import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const eventSubscriptionsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['eventSubscription'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create an event subscription', action: 'Create an event subscription' },
			{ name: 'Get', value: 'get', description: 'Get an event subscription', action: 'Get an event subscription' },
			{ name: 'Get Many', value: 'getMany', description: 'List event subscriptions', action: 'List event subscriptions' },
			{ name: 'Update', value: 'update', description: 'Update an event subscription', action: 'Update an event subscription' },
			{ name: 'Delete', value: 'delete', description: 'Delete an event subscription', action: 'Delete an event subscription' },
		],
		default: 'getMany',
	},
];

export const eventSubscriptionsFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['eventSubscription'] } } },
	{
		displayName: 'Subscription ID',
		name: 'subscriptionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['eventSubscription'], operation: ['get', 'update', 'delete'] } },
	},
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['eventSubscription'], operation: ['create', 'update'] } },
	},
	{
		displayName: 'Event Types',
		name: 'eventTypes',
		type: 'string',
		default: '',
		description: 'Comma-separated list of event types',
		displayOptions: { show: { resource: ['eventSubscription'], operation: ['create', 'update'] } },
	},
];
