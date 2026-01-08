import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

// Identity Provider Operations
export const identityProviderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['identityProvider'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create identity provider', action: 'Create identity provider' },
			{ name: 'Delete', value: 'delete', description: 'Delete identity provider', action: 'Delete identity provider' },
			{ name: 'Get', value: 'get', description: 'Get identity provider', action: 'Get identity provider' },
			{ name: 'Get Many', value: 'getMany', description: 'List identity providers', action: 'List identity providers' },
			{ name: 'Update', value: 'update', description: 'Update identity provider', action: 'Update identity provider' },
		],
		default: 'getMany',
	},
];

export const identityProviderFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['identityProvider'] } } },
	{
		displayName: 'Provider ID',
		name: 'providerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['identityProvider'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Provider Name',
		name: 'providerName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['identityProvider'], operation: ['create'] } },
	},
	{
		displayName: 'Provider Type',
		name: 'providerType',
		type: 'options',
		options: [
			{ name: 'Azure AD', value: 'azuread' },
			{ name: 'GitHub', value: 'github' },
			{ name: 'Google', value: 'google' },
			{ name: 'Okta', value: 'okta' },
			{ name: 'One-Time Pin', value: 'onetimepin' },
			{ name: 'SAML', value: 'saml' },
		],
		default: 'onetimepin',
		displayOptions: { show: { resource: ['identityProvider'], operation: ['create'] } },
	},
];

// Access Group Operations
export const accessGroupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['accessGroup'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create access group', action: 'Create access group' },
			{ name: 'Delete', value: 'delete', description: 'Delete access group', action: 'Delete access group' },
			{ name: 'Get', value: 'get', description: 'Get access group', action: 'Get access group' },
			{ name: 'Get Many', value: 'getMany', description: 'List access groups', action: 'List access groups' },
			{ name: 'Update', value: 'update', description: 'Update access group', action: 'Update access group' },
		],
		default: 'getMany',
	},
];

export const accessGroupFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['accessGroup'] } } },
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['accessGroup'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['accessGroup'], operation: ['create'] } },
	},
	{
		displayName: 'Include Rules (JSON)',
		name: 'includeRules',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['accessGroup'], operation: ['create', 'update'] } },
	},
];

// Service Token Operations
export const serviceTokenOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['serviceToken'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create service token', action: 'Create service token' },
			{ name: 'Delete', value: 'delete', description: 'Delete service token', action: 'Delete service token' },
			{ name: 'Get Many', value: 'getMany', description: 'List service tokens', action: 'List service tokens' },
			{ name: 'Refresh', value: 'refresh', description: 'Refresh service token', action: 'Refresh service token' },
			{ name: 'Rotate', value: 'rotate', description: 'Rotate service token secret', action: 'Rotate service token' },
		],
		default: 'getMany',
	},
];

export const serviceTokenFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['serviceToken'] } } },
	{
		displayName: 'Token ID',
		name: 'tokenId',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['serviceToken'], operation: ['delete', 'refresh', 'rotate'] } },
	},
	{
		displayName: 'Token Name',
		name: 'tokenName',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['serviceToken'], operation: ['create'] } },
	},
	{
		displayName: 'Duration (Years)',
		name: 'tokenDuration',
		type: 'number',
		default: 1,
		displayOptions: { show: { resource: ['serviceToken'], operation: ['create'] } },
	},
];
