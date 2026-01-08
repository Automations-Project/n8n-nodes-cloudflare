import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const customHostnamesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['customHostname'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a custom hostname', action: 'Create a custom hostname' },
			{ name: 'Delete', value: 'delete', description: 'Delete a custom hostname', action: 'Delete a custom hostname' },
			{ name: 'Get', value: 'get', description: 'Get a custom hostname', action: 'Get a custom hostname' },
			{ name: 'Get Many', value: 'getMany', description: 'List custom hostnames', action: 'List custom hostnames' },
			{ name: 'Update', value: 'update', description: 'Update a custom hostname', action: 'Update a custom hostname' },
		],
		default: 'getMany',
	},
];

export const customHostnamesFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['customHostname'] } } },
	{
		displayName: 'Hostname ID',
		name: 'hostnameId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['customHostname'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Hostname',
		name: 'hostname',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'app.example.com',
		displayOptions: { show: { resource: ['customHostname'], operation: ['create'] } },
	},
	{
		displayName: 'SSL Method',
		name: 'sslMethod',
		type: 'options',
		options: [
			{ name: 'HTTP', value: 'http' },
			{ name: 'TXT', value: 'txt' },
			{ name: 'Email', value: 'email' },
		],
		default: 'http',
		displayOptions: { show: { resource: ['customHostname'], operation: ['create', 'update'] } },
	},
	{
		displayName: 'SSL Type',
		name: 'sslType',
		type: 'options',
		options: [
			{ name: 'DV', value: 'dv' },
		],
		default: 'dv',
		displayOptions: { show: { resource: ['customHostname'], operation: ['create'] } },
	},
];
