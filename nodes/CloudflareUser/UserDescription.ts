import { INodeProperties } from 'n8n-workflow';

// ===========================================
//         User Operations
// ===========================================
export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get current user details',
				action: 'Get user details',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update user settings',
				action: 'Update user settings',
			},
		],
		default: 'get',
	},
];

export const userFields: INodeProperties[] = [
	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'User country code (e.g., US)',
			},
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'User first name',
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'User last name',
			},
			{
				displayName: 'Telephone',
				name: 'telephone',
				type: 'string',
				default: '',
				description: 'User phone number',
			},
			{
				displayName: 'Zipcode',
				name: 'zipcode',
				type: 'string',
				default: '',
				description: 'User postal/zip code',
			},
		],
	},
];
