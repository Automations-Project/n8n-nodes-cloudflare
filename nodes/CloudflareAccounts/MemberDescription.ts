import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

// ===========================================
//         Member Operations
// ===========================================
export const memberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['member'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add a member to an account',
				action: 'Add a member',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove a member from an account',
				action: 'Remove a member',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get member details',
				action: 'Get a member',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List account members',
				action: 'List members',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update member roles',
				action: 'Update a member',
			},
		],
		default: 'getMany',
	},
];

export const memberFields: INodeProperties[] = [
	// Account ID for all member operations
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['member'],
			},
		},
	},

	// Member ID for get/update/delete
	{
		displayName: 'Member ID',
		name: 'memberId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the member',
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},

	// Create fields
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@example.com',
		required: true,
		default: '',
		description: 'Email address to invite',
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Roles',
		name: 'roles',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'role-ID-1,role-ID-2',
		description: 'Comma-separated list of role IDs to assign',
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{ name: 'Accepted', value: 'accepted' },
			{ name: 'Pending', value: 'pending' },
		],
		default: 'pending',
		description: 'Initial member status',
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['create'],
			},
		},
	},

	// Update fields
	{
		displayName: 'Roles',
		name: 'updateRoles',
		type: 'string',
		default: '',
		placeholder: 'role-ID-1,role-ID-2',
		description: 'Comma-separated list of role IDs to assign',
		displayOptions: {
			show: {
				resource: ['member'],
				operation: ['update'],
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
				resource: ['member'],
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
				resource: ['member'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
