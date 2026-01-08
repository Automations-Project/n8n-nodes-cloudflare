import { INodeProperties } from 'n8n-workflow';

export const organizationsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['organization'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get an organization', action: 'Get organization' },
			{ name: 'Get Many', value: 'getMany', description: 'List organizations', action: 'List organizations' },
			{ name: 'Leave', value: 'leave', description: 'Leave an organization', action: 'Leave organization' },
		],
		default: 'getMany',
	},
];

export const organizationsFields: INodeProperties[] = [
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['organization'], operation: ['get', 'leave'] } },
	},
];
