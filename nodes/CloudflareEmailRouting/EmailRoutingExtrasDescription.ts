import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

// ============= Email Routing DNS =============
export const emailRoutingDnsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['emailRoutingDns'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get Email Routing DNS settings',
				action: 'Get email routing DNS settings',
			},
		],
		default: 'get',
	},
];

export const emailRoutingDnsFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['emailRoutingDns'],
			},
		},
	},
];

// ============= Catch-All Rule =============
export const catchAllOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['catchAll'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get catch-all rule',
				action: 'Get catch all rule',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update catch-all rule',
				action: 'Update catch all rule',
			},
		],
		default: 'get',
	},
];

export const catchAllFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['catchAll'],
			},
		},
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		required: true,
		description: 'Whether the catch-all rule is enabled',
		displayOptions: {
			show: {
				resource: ['catchAll'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Actions (JSON)',
		name: 'actionsJson',
		type: 'json',
		required: true,
		default: '[]',
		placeholder: '[{"type": "forward", "value": ["admin@example.com"]}]',
		description: 'Actions to perform (forward or drop)',
		displayOptions: {
			show: {
				resource: ['catchAll'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Matchers (JSON)',
		name: 'matchersJson',
		type: 'json',
		required: true,
		default: '[{"type": "all"}]',
		description: 'Matchers for the rule (typically just all)',
		displayOptions: {
			show: {
				resource: ['catchAll'],
				operation: ['update'],
			},
		},
	},
];
