import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

// ===========================================
//         Account Operations
// ===========================================
export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get account details',
				action: 'Get an account',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all accounts',
				action: 'List accounts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update account settings',
				action: 'Update an account',
			},
		],
		default: 'getMany',
	},
];

export const accountFields: INodeProperties[] = [
	// Account ID for get/update
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['get', 'update'],
			},
		},
	},

	// Get Many pagination
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['account'],
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
				resource: ['account'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},

	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Account name',
			},
		],
	},
];
