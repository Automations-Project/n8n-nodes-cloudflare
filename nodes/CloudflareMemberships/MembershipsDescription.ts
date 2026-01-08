import { INodeProperties } from 'n8n-workflow';

export const membershipsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['membership'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get a membership', action: 'Get a membership' },
			{ name: 'Get Many', value: 'getMany', description: 'List memberships', action: 'List memberships' },
			{ name: 'Update', value: 'update', description: 'Update a membership', action: 'Update a membership' },
			{ name: 'Delete', value: 'delete', description: 'Delete a membership', action: 'Delete a membership' },
		],
		default: 'getMany',
	},
];

export const membershipsFields: INodeProperties[] = [
	{
		displayName: 'Membership ID',
		name: 'membershipId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['membership'], operation: ['get', 'update', 'delete'] } },
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{ name: 'Accepted', value: 'accepted' },
			{ name: 'Pending', value: 'pending' },
			{ name: 'Rejected', value: 'rejected' },
		],
		default: 'accepted',
		displayOptions: { show: { resource: ['membership'], operation: ['update'] } },
	},
];
