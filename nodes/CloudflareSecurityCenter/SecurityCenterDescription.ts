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
			{ name: 'Dismiss', value: 'dismiss', description: 'Dismiss an insight', action: 'Dismiss insight' },
		],
		default: 'getMany',
	},
	// NOTE: The "issue" resource was removed as it does not exist in the Cloudflare API.
	// The dismiss operation is available under insights as per the API spec.
];

export const securityCenterFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['insight'] } } },
	{
		displayName: 'Insight ID',
		name: 'insightId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['insight'], operation: ['dismiss'] } },
	},
];
