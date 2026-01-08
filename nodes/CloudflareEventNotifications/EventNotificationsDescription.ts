import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const eventNotificationsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['eventNotification'] } },
		options: [
			{ name: 'Get Types', value: 'getTypes', description: 'Get available alert types', action: 'Get alert types' },
			{ name: 'Create Destination', value: 'createDestination', description: 'Create a webhook destination', action: 'Create destination' },
			{ name: 'Delete Destination', value: 'deleteDestination', description: 'Delete a webhook destination', action: 'Delete destination' },
			{ name: 'Get Many Destinations', value: 'listDestinations', description: 'List webhook destinations', action: 'List destinations' },
			{ name: 'Create Policy', value: 'createPolicy', description: 'Create a notification policy', action: 'Create policy' },
			{ name: 'Get Many Policies', value: 'listPolicies', description: 'List notification policies', action: 'List policies' },
		],
		default: 'getTypes',
	},
	// R2 Bucket Event Notifications
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['r2EventNotification'] } },
		options: [
			{ name: 'Get Configuration', value: 'getR2Config', description: 'Get R2 bucket notification config', action: 'Get R2 config' },
			{ name: 'Create Queue Binding', value: 'createR2Queue', description: 'Bind R2 bucket to queue', action: 'Create R2 queue binding' },
			{ name: 'Delete Queue Binding', value: 'deleteR2Queue', description: 'Delete R2 bucket queue binding', action: 'Delete R2 queue binding' },
		],
		default: 'getR2Config',
	},
];

export const eventNotificationsFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['eventNotification'] } } },
	{
		displayName: 'Destination ID',
		name: 'destinationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['eventNotification'], operation: ['deleteDestination'] } },
	},
	{
		displayName: 'Destination Name',
		name: 'destinationName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['eventNotification'], operation: ['createDestination'] } },
	},
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['eventNotification'], operation: ['createDestination'] } },
	},
	{
		displayName: 'Policy Name',
		name: 'policyName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['eventNotification'], operation: ['createPolicy'] } },
	},
	{
		displayName: 'Alert Type',
		name: 'alertType',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['eventNotification'], operation: ['createPolicy'] } },
	},
	// R2 Event Notification Fields
	{ ...accountIdField, displayOptions: { show: { resource: ['r2EventNotification'] } } },
	{
		displayName: 'Bucket Name',
		name: 'bucketName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['r2EventNotification'] } },
	},
	{
		displayName: 'Queue ID',
		name: 'queueId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['r2EventNotification'], operation: ['createR2Queue', 'deleteR2Queue'] } },
	},
];
