import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const securityCenterOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['insight'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get security insights', action: 'Get insights' },
			{ name: 'Get Many', value: 'getMany', description: 'List security insights', action: 'List insights' },
		],
		default: 'getMany',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['issue'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', description: 'List security issues', action: 'List issues' },
			{ name: 'Dismiss', value: 'dismiss', description: 'Dismiss an issue', action: 'Dismiss issue' },
		],
		default: 'getMany',
	},
];

export const securityCenterFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['insight', 'issue'] } } },
	{
		displayName: 'Issue ID',
		name: 'issueId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['issue'], operation: ['dismiss'] } },
	},
];
