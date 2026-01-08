import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const subnetsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['subnet'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a virtual network subnet', action: 'Create a subnet' },
			{ name: 'Delete', value: 'delete', description: 'Delete a virtual network subnet', action: 'Delete a subnet' },
			{ name: 'Get Many', value: 'getMany', description: 'List virtual network subnets', action: 'List subnets' },
			{ name: 'Update', value: 'update', description: 'Update a virtual network subnet', action: 'Update a subnet' },
		],
		default: 'getMany',
	},
];

export const subnetsFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['subnet'] } } },
	{
		displayName: 'Subnet ID',
		name: 'subnetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['subnet'], operation: ['delete', 'update'] } },
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		default: '',
		placeholder: '10.0.0.0/24',
		displayOptions: { show: { resource: ['subnet'], operation: ['create'] } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['subnet'], operation: ['create', 'update'] } },
	},
];
