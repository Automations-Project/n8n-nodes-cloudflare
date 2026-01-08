import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const botnetFeedOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['botnetFeed'] } },
		options: [
			{ name: 'Get Day Report', value: 'getDayReport', description: 'Get daily botnet report', action: 'Get day report' },
			{ name: 'Get Full Report', value: 'getFullReport', description: 'Get full botnet report', action: 'Get full report' },
			{ name: 'Delete Config', value: 'deleteConfig', description: 'Delete ASN config', action: 'Delete config' },
		],
		default: 'getDayReport',
	},
];

export const botnetFeedFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['botnetFeed'] } } },
	{
		displayName: 'ASN ID',
		name: 'asnId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['botnetFeed'] } },
	},
];
