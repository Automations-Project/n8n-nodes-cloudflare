import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const turnKeyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['turnKey'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a TURN key',
				action: 'Create a TURN key',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a TURN key',
				action: 'Delete a TURN key',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a TURN key',
				action: 'Get a TURN key',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List TURN keys',
				action: 'List TURN keys',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a TURN key',
				action: 'Update a TURN key',
			},
		],
		default: 'getMany',
	},
];

export const turnKeyFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['turnKey'],
			},
		},
	},

	// ===========================================
	//         Key ID
	// ===========================================
	{
		displayName: 'Key ID',
		name: 'keyId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the TURN key',
		displayOptions: {
			show: {
				resource: ['turnKey'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},

	// ===========================================
	//         Create/Update Fields
	// ===========================================
	{
		displayName: 'Name',
		name: 'keyName',
		type: 'string',
		default: '',
		description: 'Name for the TURN key',
		displayOptions: {
			show: {
				resource: ['turnKey'],
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
				resource: ['turnKey'],
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
				resource: ['turnKey'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
