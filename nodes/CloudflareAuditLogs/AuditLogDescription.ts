import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const auditLogOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['auditLog'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List audit logs',
				action: 'List audit logs',
			},
		],
		default: 'getMany',
	},
];

export const auditLogFields: INodeProperties[] = [
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['auditLog'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['auditLog'],
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
				resource: ['auditLog'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['auditLog'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Action Type',
				name: 'action.type',
				type: 'string',
				default: '',
				description: 'Filter by action type (e.g., add, delete)',
			},
			{
				displayName: 'Actor Email',
				name: 'actor.email',
				type: 'string',
				default: '',
				description: 'Filter by actor email address',
			},
			{
				displayName: 'Actor IP',
				name: 'actor.ip',
				type: 'string',
				default: '',
				description: 'Filter by actor IP address',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'desc',
				description: 'Sort direction',
			},
			{
				displayName: 'Hide User Logs',
				name: 'hide_user_logs',
				type: 'boolean',
				default: false,
				description: 'Whether to hide user-level logs',
			},
			{
				displayName: 'Since',
				name: 'since',
				type: 'dateTime',
				default: '',
				description: 'Start of the date range (ISO 8601)',
			},
			{
				displayName: 'Until',
				name: 'before',
				type: 'dateTime',
				default: '',
				description: 'End of the date range (ISO 8601)',
			},
			{
				displayName: 'Zone Name',
				name: 'zone.name',
				type: 'string',
				default: '',
				description: 'Filter by zone name',
			},
		],
	},
];
