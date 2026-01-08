import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

// Domain Operations
export const pagesDomainOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['domain'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Add custom domain', action: 'Add custom domain' },
			{ name: 'Delete', value: 'delete', description: 'Remove custom domain', action: 'Remove custom domain' },
			{ name: 'Get', value: 'get', description: 'Get custom domain', action: 'Get custom domain' },
			{ name: 'Get Many', value: 'getMany', description: 'List custom domains', action: 'List custom domains' },
		],
		default: 'getMany',
	},
];

export const pagesDomainFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['domain'] } } },
	{
		displayName: 'Project Name or ID',
		name: 'domainProjectName',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: { loadOptionsMethod: 'getPagesProjects' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'] } },
	},
	{
		displayName: 'Domain Name',
		name: 'domainName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domain'], operation: ['create', 'get', 'delete'] } },
	},
];
