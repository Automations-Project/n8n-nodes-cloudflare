import { INodeProperties } from 'n8n-workflow';

// ===========================================
//         Token Operations
// ===========================================
export const tokenOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['token'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an API token',
				action: 'Create a token',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an API token',
				action: 'Delete a token',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get token details',
				action: 'Get a token',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List API tokens',
				action: 'List tokens',
			},
			{
				name: 'Roll',
				value: 'roll',
				description: 'Roll (regenerate) a token',
				action: 'Roll a token',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an API token',
				action: 'Update a token',
			},
			{
				name: 'Verify',
				value: 'verify',
				description: 'Verify the current token',
				action: 'Verify current token',
			},
		],
		default: 'getMany',
	},
];

export const tokenFields: INodeProperties[] = [
	// Token ID for get/update/delete/roll
	{
		displayName: 'Token ID',
		name: 'tokenId',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		description: 'ID of the token',
		displayOptions: {
			show: {
				resource: ['token'],
				operation: ['delete', 'get', 'roll', 'update'],
			},
		},
	},

	// Create fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the token',
		displayOptions: {
			show: {
				resource: ['token'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Policies (JSON)',
		name: 'policies',
		type: 'json',
		required: true,
		default: '[]',
		description: 'Token policies as JSON array',
		displayOptions: {
			show: {
				resource: ['token'],
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
				resource: ['token'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Condition (JSON)',
				name: 'condition',
				type: 'json',
				default: '{}',
				description: 'Token condition as JSON',
			},
			{
				displayName: 'Expires On',
				name: 'expires_on',
				type: 'dateTime',
				default: '',
				description: 'When the token expires',
			},
			{
				displayName: 'Not Before',
				name: 'not_before',
				type: 'dateTime',
				default: '',
				description: 'Token is not valid before this time',
			},
		],
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
				resource: ['token'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the token',
			},
			{
				displayName: 'Policies (JSON)',
				name: 'policies',
				type: 'json',
				default: '',
				description: 'Updated policies as JSON array',
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
				description: 'Token status',
			},
		],
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
				resource: ['token'],
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
				resource: ['token'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
