import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

// ===========================================
//         Argo Operations
// ===========================================
export const argoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['smartRouting'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get Argo Smart Routing status',
				action: 'Get smart routing status',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Enable/disable Argo Smart Routing',
				action: 'Update smart routing',
			},
		],
		default: 'get',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tieredCaching'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get Tiered Caching status',
				action: 'Get tiered caching status',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Enable/disable Tiered Caching',
				action: 'Update tiered caching',
			},
		],
		default: 'get',
	},
];

export const argoFields: INodeProperties[] = [
	// Zone ID for all operations
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['smartRouting', 'tieredCaching'],
			},
		},
	},

	// Smart Routing - Update value
	{
		displayName: 'Value',
		name: 'smartRoutingValue',
		type: 'options',
		options: [
			{ name: 'Off', value: 'off' },
			{ name: 'On', value: 'on' },
		],
		default: 'on',
		required: true,
		description: 'Enable or disable Argo Smart Routing',
		displayOptions: {
			show: {
				resource: ['smartRouting'],
				operation: ['update'],
			},
		},
	},

	// Tiered Caching - Update value
	{
		displayName: 'Value',
		name: 'tieredCachingValue',
		type: 'options',
		options: [
			{ name: 'Off', value: 'off' },
			{ name: 'On', value: 'on' },
		],
		default: 'on',
		required: true,
		description: 'Enable or disable Tiered Caching',
		displayOptions: {
			show: {
				resource: ['tieredCaching'],
				operation: ['update'],
			},
		},
	},
];
