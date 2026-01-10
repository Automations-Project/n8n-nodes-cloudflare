import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const dexOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dex'] } },
		options: [
			{ name: 'Get Many Tests', value: 'listTests', description: 'List DEX tests overview', action: 'List tests' },
			{ name: 'Get Colos', value: 'getColos', description: 'Get available colos for DEX', action: 'Get colos' },
		],
		default: 'listTests',
	},
];

export const dexFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['dex'] } } },
	// NOTE: Individual test CRUD operations are not available in the public Cloudflare API.
	// Only listTests (overview) and getColos are supported.
];
