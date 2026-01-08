import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const brandProtectionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['brandProtection'] } },
		options: [
			{ name: 'Submit URL', value: 'submit', description: 'Submit a URL for brand protection analysis', action: 'Submit a URL' },
			{ name: 'Get URL Info', value: 'getUrlInfo', description: 'Get brand protection status for a URL', action: 'Get URL info' },
			{ name: 'Get Many Queries', value: 'listQueries', description: 'List brand protection queries', action: 'List queries' },
			{ name: 'Get Many Matches', value: 'listMatches', description: 'List brand protection matches', action: 'List matches' },
		],
		default: 'listMatches',
	},
];

export const brandProtectionFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['brandProtection'] } } },
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		displayOptions: { show: { resource: ['brandProtection'], operation: ['submit', 'getUrlInfo'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		description: 'Whether to return all results or only up to a given limit',
		default: false,
		displayOptions: { show: { resource: ['brandProtection'], operation: ['listQueries', 'listMatches'] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		description: 'Max number of results to return',
		default: 50,
		displayOptions: { show: { resource: ['brandProtection'], operation: ['listQueries', 'listMatches'], returnAll: [false] } },
	},
];
