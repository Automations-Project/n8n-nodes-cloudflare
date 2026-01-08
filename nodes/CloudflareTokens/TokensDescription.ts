import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const tokensOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['token'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create an API token', action: 'Create a token' },
			{ name: 'Delete', value: 'delete', description: 'Delete an API token', action: 'Delete a token' },
			{ name: 'Get', value: 'get', description: 'Get an API token', action: 'Get a token' },
			{ name: 'Get Many', value: 'getMany', description: 'List API tokens', action: 'List tokens' },
			{ name: 'Verify', value: 'verify', description: 'Verify current token', action: 'Verify token' },
			{ name: 'Update', value: 'update', description: 'Update an API token', action: 'Update a token' },
		],
		default: 'getMany',
	},
	// Account Token Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['accountToken'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create an account token', action: 'Create account token' },
			{ name: 'Delete', value: 'delete', description: 'Delete an account token', action: 'Delete account token' },
			{ name: 'Get', value: 'get', description: 'Get an account token', action: 'Get account token' },
			{ name: 'Get Many', value: 'getMany', description: 'List account tokens', action: 'List account tokens' },
			{ name: 'Update', value: 'update', description: 'Update an account token', action: 'Update account token' },
		],
		default: 'getMany',
	},
];

export const tokensFields: INodeProperties[] = [
	{
		displayName: 'Token ID',
		name: 'tokenId',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['token'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Token Name',
		name: 'tokenName',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['token'], operation: ['create'] } },
	},
	{
		displayName: 'Policies (JSON)',
		name: 'policies',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['token'], operation: ['create', 'update'] } },
	},
	// Account Token Fields
	{ ...accountIdField, displayOptions: { show: { resource: ['accountToken'] } } },
	{
		displayName: 'Token ID',
		name: 'acctTokenId',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['accountToken'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Token Name',
		name: 'acctTokenName',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['accountToken'], operation: ['create'] } },
	},
	{
		displayName: 'Policies (JSON)',
		name: 'acctPolicies',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['accountToken'], operation: ['create', 'update'] } },
	},
];
