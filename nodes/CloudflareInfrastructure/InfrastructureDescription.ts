import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const infrastructureOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['infrastructure'] } },
		options: [
			{ name: 'Create Target', value: 'createTarget', description: 'Create an infrastructure target', action: 'Create a target' },
			{ name: 'Delete Target', value: 'deleteTarget', description: 'Delete an infrastructure target', action: 'Delete a target' },
			{ name: 'Get Target', value: 'getTarget', description: 'Get an infrastructure target', action: 'Get a target' },
			{ name: 'Get Many Targets', value: 'listTargets', description: 'List infrastructure targets', action: 'List targets' },
			{ name: 'Update Target', value: 'updateTarget', description: 'Update an infrastructure target', action: 'Update a target' },
		],
		default: 'listTargets',
	},
];

export const infrastructureFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['infrastructure'] } } },
	{
		displayName: 'Target ID',
		name: 'targetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['infrastructure'], operation: ['getTarget', 'deleteTarget', 'updateTarget'] } },
	},
	{
		displayName: 'Hostname',
		name: 'hostname',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['infrastructure'], operation: ['createTarget'] } },
	},
	{
		displayName: 'IP Address',
		name: 'ipAddress',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['infrastructure'], operation: ['createTarget', 'updateTarget'] } },
	},
];
