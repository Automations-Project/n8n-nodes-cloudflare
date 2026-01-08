import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const lockdownOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lockdown'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a zone lockdown rule',
				action: 'Create a zone lockdown rule',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a zone lockdown rule',
				action: 'Delete a zone lockdown rule',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a zone lockdown rule',
				action: 'Get a zone lockdown rule',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List zone lockdown rules',
				action: 'Get many zone lockdown rules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a zone lockdown rule',
				action: 'Update a zone lockdown rule',
			},
		],
		default: 'getMany',
	},
];

export const lockdownFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['lockdown'],
			},
		},
	},
	{
		displayName: 'Lockdown ID',
		name: 'lockdownId',
		type: 'string',
		required: true,
		default: '',
		description: 'The lockdown rule identifier',
		displayOptions: {
			show: {
				resource: ['lockdown'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'URLs (Comma Separated)',
		name: 'urls',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'api.example.com/some/endpoint*',
		description: 'URLs to lock down (supports wildcards)',
		displayOptions: {
			show: {
				resource: ['lockdown'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Configurations (JSON)',
		name: 'configurationsJson',
		type: 'json',
		required: true,
		default: '[]',
		placeholder: '[{"target": "ip", "value": "1.2.3.4"}]',
		description: 'Array of IP or IP range configurations that can access the URLs',
		displayOptions: {
			show: {
				resource: ['lockdown'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['lockdown'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Configurations (JSON)',
				name: 'configurations',
				type: 'json',
				default: '[]',
				description: 'Array of IP/CIDR configurations',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the lockdown rule',
			},
			{
				displayName: 'Paused',
				name: 'paused',
				type: 'boolean',
				default: false,
				description: 'Whether the rule is paused',
			},
			{
				displayName: 'URLs (Comma Separated)',
				name: 'urls',
				type: 'string',
				default: '',
				description: 'URLs to lock down',
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
				resource: ['lockdown'],
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
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['lockdown'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
