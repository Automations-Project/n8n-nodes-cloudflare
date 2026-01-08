import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

// ===========================================
//         Role Operations
// ===========================================
export const roleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['role'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get role details',
				action: 'Get a role',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List account roles',
				action: 'List roles',
			},
		],
		default: 'getMany',
	},
];

export const roleFields: INodeProperties[] = [
	// Account ID for all role operations
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['role'],
			},
		},
	},

	// Role ID for get
	{
		displayName: 'Role ID',
		name: 'roleId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the role',
		displayOptions: {
			show: {
				resource: ['role'],
				operation: ['get'],
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
				resource: ['role'],
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
				resource: ['role'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
