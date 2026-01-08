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
			{ name: 'Create Test', value: 'createTest', description: 'Create a DEX test', action: 'Create a test' },
			{ name: 'Delete Test', value: 'deleteTest', description: 'Delete a DEX test', action: 'Delete a test' },
			{ name: 'Get Test', value: 'getTest', description: 'Get a DEX test', action: 'Get a test' },
			{ name: 'Get Many Tests', value: 'listTests', description: 'List DEX tests', action: 'List tests' },
			{ name: 'Update Test', value: 'updateTest', description: 'Update a DEX test', action: 'Update a test' },
			{ name: 'Get Colos', value: 'getColos', description: 'Get available colos for DEX', action: 'Get colos' },
		],
		default: 'listTests',
	},
];

export const dexFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['dex'] } } },
	{
		displayName: 'Test ID',
		name: 'testId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dex'], operation: ['getTest', 'deleteTest', 'updateTest'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dex'], operation: ['createTest'] } },
	},
	{
		displayName: 'Test Type',
		name: 'testType',
		type: 'options',
		options: [
			{ name: 'HTTP', value: 'http' },
			{ name: 'ICMP', value: 'icmp' },
			{ name: 'Traceroute', value: 'traceroute' },
		],
		default: 'http',
		displayOptions: { show: { resource: ['dex'], operation: ['createTest'] } },
	},
	{
		displayName: 'Target URL',
		name: 'targetUrl',
		type: 'string',
		default: '',
		placeholder: 'https://example.com',
		displayOptions: { show: { resource: ['dex'], operation: ['createTest', 'updateTest'] } },
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['dex'], operation: ['createTest', 'updateTest'] } },
	},
];
