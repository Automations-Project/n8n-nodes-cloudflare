import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const zoneSubscriptionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['zoneSubscription'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get zone subscription', action: 'Get zone subscription' },
			{ name: 'Create', value: 'create', description: 'Create zone subscription', action: 'Create zone subscription' },
			{ name: 'Update', value: 'update', description: 'Update zone subscription', action: 'Update zone subscription' },
		],
		default: 'get',
	},
];

export const zoneSubscriptionFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['zoneSubscription'] } } },
	{
		displayName: 'Rate Plan',
		name: 'ratePlan',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['zoneSubscription'], operation: ['create', 'update'] } },
	},
];
