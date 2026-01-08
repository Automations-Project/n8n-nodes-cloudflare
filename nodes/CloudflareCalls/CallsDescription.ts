import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const callsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['app'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a Calls app',
				action: 'Create a calls app',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a Calls app',
				action: 'Delete a calls app',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List Calls apps',
				action: 'List calls apps',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a Calls app',
				action: 'Update a calls app',
			},
		],
		default: 'getMany',
	},
];

export const callsFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['app'],
			},
		},
	},

	// ===========================================
	//         App ID
	// ===========================================
	{
		displayName: 'App ID',
		name: 'appId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the Calls app',
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['delete', 'update'],
			},
		},
	},

	// ===========================================
	//         Create/Update Options
	// ===========================================
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the Calls app',
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['create', 'update'],
			},
		},
	},

	// ===========================================
	//         Get Many Options
	// ===========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['app'],
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
				resource: ['app'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
