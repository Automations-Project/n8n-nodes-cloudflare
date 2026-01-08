import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const leakedCredentialChecksOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['leakedCredentialChecks'] } },
		options: [
			{ name: 'Get Status', value: 'getStatus', description: 'Get leak detection status', action: 'Get status' },
			{ name: 'Enable', value: 'enable', description: 'Enable leaked credential checks', action: 'Enable checks' },
			{ name: 'Disable', value: 'disable', description: 'Disable leaked credential checks', action: 'Disable checks' },
			{ name: 'Get Many Detections', value: 'listDetections', description: 'List detected leaks', action: 'List detections' },
		],
		default: 'getStatus',
	},
];

export const leakedCredentialChecksFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['leakedCredentialChecks'] } } },
];
