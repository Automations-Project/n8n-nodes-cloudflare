import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const addressMapsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['addressMap'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create an address map', action: 'Create an address map' },
			{ name: 'Delete', value: 'delete', description: 'Delete an address map', action: 'Delete an address map' },
			{ name: 'Get', value: 'get', description: 'Get an address map', action: 'Get an address map' },
			{ name: 'Get Many', value: 'getMany', description: 'List address maps', action: 'List address maps' },
			{ name: 'Update', value: 'update', description: 'Update an address map', action: 'Update an address map' },
		],
		default: 'getMany',
	},
];

export const addressMapsFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['addressMap'] } } },
	{
		displayName: 'Address Map ID',
		name: 'addressMapId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['addressMap'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['addressMap'], operation: ['create', 'update'] } },
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['addressMap'], operation: ['create', 'update'] } },
	},
];
