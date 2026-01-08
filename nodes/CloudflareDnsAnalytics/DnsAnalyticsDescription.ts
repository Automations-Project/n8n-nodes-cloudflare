import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const dnsAnalyticsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dnsAnalytics'] } },
		options: [
			{ name: 'Get Report', value: 'getReport', description: 'Get DNS analytics report', action: 'Get report' },
			{ name: 'Get Report By Time', value: 'getReportByTime', description: 'Get DNS analytics by time', action: 'Get report by time' },
		],
		default: 'getReport',
	},
];

export const dnsAnalyticsFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['dnsAnalytics'] } } },
	{
		displayName: 'Dimensions',
		name: 'dimensions',
		type: 'string',
		default: 'queryName',
		description: 'Comma-separated list of dimensions',
		displayOptions: { show: { resource: ['dnsAnalytics'] } },
	},
	{
		displayName: 'Metrics',
		name: 'metrics',
		type: 'string',
		default: 'queryCount',
		description: 'Comma-separated list of metrics',
		displayOptions: { show: { resource: ['dnsAnalytics'] } },
	},
];
