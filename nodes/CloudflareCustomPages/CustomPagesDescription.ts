import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const customPagesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['customPage'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get a custom page', action: 'Get a custom page' },
			{ name: 'Get Many', value: 'getMany', description: 'List custom pages', action: 'List custom pages' },
			{ name: 'Update', value: 'update', description: 'Update a custom page', action: 'Update a custom page' },
		],
		default: 'getMany',
	},
];

export const customPagesFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['customPage'] } } },
	{
		displayName: 'Page ID',
		name: 'pageId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['customPage'], operation: ['get', 'update'] } },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['customPage'], operation: ['update'] } },
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'options',
		options: [
			{ name: 'Default', value: 'default' },
			{ name: 'Customized', value: 'customized' },
		],
		default: 'default',
		displayOptions: { show: { resource: ['customPage'], operation: ['update'] } },
	},
];
