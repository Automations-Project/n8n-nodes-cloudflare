import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const teamnetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['teamnet'] } },
		options: [
			{ name: 'Create Route', value: 'createRoute', description: 'Create a tunnel route', action: 'Create a route' },
			{ name: 'Delete Route', value: 'deleteRoute', description: 'Delete a tunnel route', action: 'Delete a route' },
			{ name: 'Get Many Routes', value: 'listRoutes', description: 'List tunnel routes', action: 'List routes' },
			{ name: 'Get Route', value: 'getRoute', description: 'Get a tunnel route', action: 'Get a route' },
			{ name: 'Update Route', value: 'updateRoute', description: 'Update a tunnel route', action: 'Update a route' },
		],
		default: 'listRoutes',
	},
];

export const teamnetFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['teamnet'] } } },
	{
		displayName: 'Route ID',
		name: 'routeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['teamnet'], operation: ['getRoute', 'deleteRoute', 'updateRoute'] } },
	},
	{
		displayName: 'Network CIDR',
		name: 'network',
		type: 'string',
		required: true,
		default: '',
		placeholder: '10.0.0.0/8',
		displayOptions: { show: { resource: ['teamnet'], operation: ['createRoute'] } },
	},
	{
		displayName: 'Tunnel ID',
		name: 'tunnelId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['teamnet'], operation: ['createRoute'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['teamnet'], operation: ['createRoute', 'updateRoute'] } },
	},
];
