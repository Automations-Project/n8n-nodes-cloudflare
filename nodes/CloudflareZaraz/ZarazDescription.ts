import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const zarazOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['config'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get Zaraz configuration',
				action: 'Get configuration',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update Zaraz configuration',
				action: 'Update configuration',
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
				resource: ['tool'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List Zaraz tools',
				action: 'List tools',
			},
		],
		default: 'getMany',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['history'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List configuration history',
				action: 'List history',
			},
			{
				name: 'Publish',
				value: 'publish',
				description: 'Publish configuration changes',
				action: 'Publish configuration',
			},
		],
		default: 'getMany',
	},
];

export const zarazFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['config', 'tool', 'history'],
			},
		},
	},

	// Config update fields
	{
		displayName: 'Configuration (JSON)',
		name: 'configJson',
		type: 'json',
		required: true,
		default: '{}',
		description: 'Zaraz configuration as JSON',
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['update'],
			},
		},
	},

	// Publish fields
	{
		displayName: 'Description',
		name: 'publishDescription',
		type: 'string',
		default: '',
		description: 'Description for the publish action',
		displayOptions: {
			show: {
				resource: ['history'],
				operation: ['publish'],
			},
		},
	},

	// Pagination
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['tool', 'history'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['tool', 'history'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
