import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const contentUploadScanOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['contentUploadScan'] } },
		options: [
			{ name: 'Get Status', value: 'getStatus', description: 'Get content upload scan status', action: 'Get status' },
			{ name: 'Enable', value: 'enable', description: 'Enable content upload scanning', action: 'Enable scanning' },
			{ name: 'Disable', value: 'disable', description: 'Disable content upload scanning', action: 'Disable scanning' },
			{ name: 'Get Payloads', value: 'getPayloads', description: 'Get custom scan payloads', action: 'Get payloads' },
		],
		default: 'getStatus',
	},
];

export const contentUploadScanFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['contentUploadScan'] } } },
];
