import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const prefixesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['prefix'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Add a prefix', action: 'Create a prefix' },
			{ name: 'Delete', value: 'delete', description: 'Delete a prefix', action: 'Delete a prefix' },
			{ name: 'Get', value: 'get', description: 'Get a prefix', action: 'Get a prefix' },
			{ name: 'Get Many', value: 'getMany', description: 'List prefixes', action: 'List prefixes' },
			{ name: 'Update', value: 'update', description: 'Update a prefix', action: 'Update a prefix' },
		],
		default: 'getMany',
	},
];

export const prefixesFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['prefix'] } } },
	{
		displayName: 'Prefix ID',
		name: 'prefixId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['prefix'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'CIDR',
		name: 'cidr',
		type: 'string',
		required: true,
		default: '',
		placeholder: '192.0.2.0/24',
		displayOptions: { show: { resource: ['prefix'], operation: ['create'] } },
	},
	{
		displayName: 'ASN',
		name: 'asn',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['prefix'], operation: ['create'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['prefix'], operation: ['create', 'update'] } },
	},
];
