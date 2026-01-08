import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const cacheReserveOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cacheReserve'],
			},
		},
		options: [
			{
				name: 'Clear',
				value: 'clear',
				description: 'Clear Cache Reserve',
				action: 'Clear cache reserve',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get Cache Reserve settings',
				action: 'Get cache reserve settings',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get Cache Reserve clear status',
				action: 'Get cache reserve clear status',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update Cache Reserve settings',
				action: 'Update cache reserve settings',
			},
		],
		default: 'get',
	},
];

export const cacheReserveFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['cacheReserve'],
			},
		},
	},
	{
		displayName: 'Enable Cache Reserve',
		name: 'enabled',
		type: 'boolean',
		required: true,
		default: true,
		description: 'Whether to enable Cache Reserve',
		displayOptions: {
			show: {
				resource: ['cacheReserve'],
				operation: ['update'],
			},
		},
	},
];
