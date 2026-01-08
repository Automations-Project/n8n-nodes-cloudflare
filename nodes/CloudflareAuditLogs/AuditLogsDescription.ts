import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const auditLogsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['auditLog'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', description: 'List audit logs', action: 'List audit logs' },
		],
		default: 'getMany',
	},
];

export const auditLogsFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['auditLog'] } } },
	{
		displayName: 'Since',
		name: 'since',
		type: 'dateTime',
		default: '',
		description: 'Start of the time range',
		displayOptions: { show: { resource: ['auditLog'], operation: ['getMany'] } },
	},
	{
		displayName: 'Before',
		name: 'before',
		type: 'dateTime',
		default: '',
		description: 'End of the time range',
		displayOptions: { show: { resource: ['auditLog'], operation: ['getMany'] } },
	},
	{
		displayName: 'Action Type',
		name: 'actionType',
		type: 'string',
		default: '',
		description: 'Filter by action type',
		displayOptions: { show: { resource: ['auditLog'], operation: ['getMany'] } },
	},
];
