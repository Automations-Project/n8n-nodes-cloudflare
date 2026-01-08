import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const managedHeadersOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['managedHeaders'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get managed headers', action: 'Get managed headers' },
			{ name: 'Update', value: 'update', description: 'Update managed headers', action: 'Update managed headers' },
		],
		default: 'get',
	},
];

export const managedHeadersFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['managedHeaders'] } } },
	{
		displayName: 'Headers Config (JSON)',
		name: 'headersConfig',
		type: 'json',
		default: '{"managed_request_headers": [], "managed_response_headers": []}',
		displayOptions: { show: { resource: ['managedHeaders'], operation: ['update'] } },
	},
];
