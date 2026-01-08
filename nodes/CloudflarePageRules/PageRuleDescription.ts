import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const pageRuleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pageRule'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a page rule',
				action: 'Create a page rule',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a page rule',
				action: 'Delete a page rule',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get page rule details',
				action: 'Get a page rule',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List page rules',
				action: 'Get many page rules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a page rule',
				action: 'Update a page rule',
			},
		],
		default: 'getMany',
	},
];

export const pageRuleFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['pageRule'],
			},
		},
	},
	{
		displayName: 'Page Rule ID',
		name: 'pageRuleId',
		type: 'string',
		required: true,
		default: '',
		description: 'The page rule identifier',
		displayOptions: {
			show: {
				resource: ['pageRule'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'URL Pattern',
		name: 'urlPattern',
		type: 'string',
		required: true,
		default: '',
		placeholder: '*example.com/*',
		description: 'URL pattern to match (supports wildcards)',
		displayOptions: {
			show: {
				resource: ['pageRule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Actions (JSON)',
		name: 'actionsJson',
		type: 'json',
		required: true,
		default: '[]',
		description: 'Array of actions to apply (e.g., [{"ID": "always_online", "value": "on"}])',
		displayOptions: {
			show: {
				resource: ['pageRule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Create Options',
		name: 'createOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['pageRule'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				default: 1,
				description: 'Priority of the rule (higher = more priority)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Disabled', value: 'disabled' },
				],
				default: 'active',
				description: 'Status of the page rule',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['pageRule'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Actions (JSON)',
				name: 'actions',
				type: 'json',
				default: '[]',
				description: 'Array of actions to apply',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				default: 1,
				description: 'Priority of the rule',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Disabled', value: 'disabled' },
				],
				default: 'active',
				description: 'Status of the page rule',
			},
			{
				displayName: 'URL Pattern',
				name: 'targets',
				type: 'string',
				default: '',
				description: 'URL pattern to match',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['pageRule'],
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
				resource: ['pageRule'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
