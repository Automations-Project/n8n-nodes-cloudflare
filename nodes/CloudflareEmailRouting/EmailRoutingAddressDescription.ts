import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const emailRoutingAddressOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['address'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create (verify) a destination address',
				action: 'Create a destination address',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a destination address',
				action: 'Delete a destination address',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a destination address',
				action: 'Get a destination address',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List destination addresses',
				action: 'List destination addresses',
			},
		],
		default: 'getMany',
	},
];

export const emailRoutingAddressFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['address'],
			},
		},
	},

	// ===========================================
	//         Address ID
	// ===========================================
	{
		displayName: 'Address ID',
		name: 'addressId',
		type: 'string',
		required: true,
		default: '',
		description: 'Destination Address identifier',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['delete', 'get'],
			},
		},
	},

	// ===========================================
	//         Create Fields
	// ===========================================
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'name@email.com',
		description: 'The email address to verify',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
	},

	// ===========================================
	//         Get Many options
	// ===========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['address'],
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
				resource: ['address'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
