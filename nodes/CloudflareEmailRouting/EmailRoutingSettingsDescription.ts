import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const emailRoutingSettingsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['settings'],
			},
		},
		options: [
			{
				name: 'Disable',
				value: 'disable',
				description: 'Disable email routing for a zone',
				action: 'Disable email routing',
			},
			{
				name: 'Enable',
				value: 'enable',
				description: 'Enable email routing for a zone',
				action: 'Enable email routing',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get email routing settings',
				action: 'Get email routing settings',
			},
			{
				name: 'Get Catch All',
				value: 'getCatchAll',
				description: 'Get catch all rule settings',
				action: 'Get catch all rule',
			},
			{
				name: 'Update Catch All',
				value: 'updateCatchAll',
				description: 'Update catch all rule settings',
				action: 'Update catch all rule',
			},
		],
		default: 'get',
	},
];

export const emailRoutingSettingsFields: INodeProperties[] = [
	// ===========================================
	//         Zone ID
	// ===========================================
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['settings'],
			},
		},
	},

	// ===========================================
	//         Catch-All Update Fields
	// ===========================================
	{
		displayName: 'Catch-All Enabled',
		name: 'catchAllEnabled',
		type: 'boolean',
		required: true,
		default: true,
		description: 'Whether the catch-all rule is enabled',
		displayOptions: {
			show: {
				resource: ['settings'],
				operation: ['updateCatchAll'],
			},
		},
	},
	{
		displayName: 'Action Type',
		name: 'catchAllActionType',
		type: 'options',
		options: [
			{ name: 'Forward', value: 'forward' },
			{ name: 'Drop', value: 'drop' },
		],
		default: 'forward',
		description: 'Action to take for catch-all emails',
		displayOptions: {
			show: {
				resource: ['settings'],
				operation: ['updateCatchAll'],
			},
		},
	},
	{
		displayName: 'Forward To',
		name: 'catchAllForwardTo',
		type: 'string',
		default: '',
		placeholder: 'catchall@example.com',
		description: 'Email address to forward catch-all emails to',
		displayOptions: {
			show: {
				resource: ['settings'],
				operation: ['updateCatchAll'],
				catchAllActionType: ['forward'],
			},
		},
	},
];
