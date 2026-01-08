import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const listsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['list'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a list', action: 'Create a list' },
			{ name: 'Delete', value: 'delete', description: 'Delete a list', action: 'Delete a list' },
			{ name: 'Get', value: 'get', description: 'Get a list', action: 'Get a list' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many lists', action: 'Get many lists' },
			{ name: 'Update', value: 'update', description: 'Update a list', action: 'Update a list' },
			{ name: 'Get Items', value: 'getItems', description: 'Get items in a list', action: 'Get list items' },
			{ name: 'Create Items', value: 'createItems', description: 'Add items to a list', action: 'Add items to a list' },
			{ name: 'Delete Items', value: 'deleteItems', description: 'Remove items from a list', action: 'Remove items from a list' },
		],
		default: 'getMany',
	},
];

export const listsFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['list'] } } },
	{
		displayName: 'List ID',
		name: 'listId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['list'], operation: ['get', 'delete', 'update', 'getItems', 'createItems', 'deleteItems'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['list'], operation: ['create'] } },
	},
	{
		displayName: 'Kind',
		name: 'kind',
		type: 'options',
		options: [
			{ name: 'IP', value: 'ip' },
			{ name: 'Redirect', value: 'redirect' },
			{ name: 'Hostname', value: 'hostname' },
			{ name: 'ASN', value: 'asn' },
		],
		default: 'ip',
		displayOptions: { show: { resource: ['list'], operation: ['create'] } },
	},
	{
		displayName: 'Items (JSON Array)',
		name: 'items',
		type: 'json',
		default: '[]',
		placeholder: '[{"ip": "192.0.2.1"}, {"ip": "192.0.2.2"}]',
		displayOptions: { show: { resource: ['list'], operation: ['createItems', 'deleteItems'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['list'], operation: ['create', 'update'] } },
	},
];
