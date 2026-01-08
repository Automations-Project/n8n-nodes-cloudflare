import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const billingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['billing'] } },
		options: [
			{ name: 'Get Profile', value: 'getProfile', description: 'Get billing profile', action: 'Get billing profile' },
		],
		default: 'getProfile',
	},
];

export const billingFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['billing'] } } },
];
