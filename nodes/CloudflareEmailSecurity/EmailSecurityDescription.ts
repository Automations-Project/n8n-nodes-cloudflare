import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const emailSecurityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['emailSecurity'],
			},
		},
		options: [
			{
				name: 'Get Settings',
				value: 'getSettings',
				description: 'Get email security settings',
				action: 'Get email security settings',
			},
			{
				name: 'Get Trusted Domains',
				value: 'getTrustedDomains',
				description: 'Get trusted domains list',
				action: 'Get trusted domains',
			},
			{
				name: 'Create Trusted Domain',
				value: 'createTrustedDomain',
				description: 'Add a trusted domain',
				action: 'Create trusted domain',
			},
			{
				name: 'Delete Trusted Domain',
				value: 'deleteTrustedDomain',
				description: 'Remove a trusted domain',
				action: 'Delete trusted domain',
			},
			{
				name: 'Get Impersonation Registry',
				value: 'getImpersonationRegistry',
				description: 'Get impersonation registry entries',
				action: 'Get impersonation registry',
			},
			{
				name: 'Create Impersonation Entry',
				value: 'createImpersonationEntry',
				description: 'Add an impersonation registry entry',
				action: 'Create impersonation entry',
			},
			{
				name: 'Delete Impersonation Entry',
				value: 'deleteImpersonationEntry',
				description: 'Remove an impersonation registry entry',
				action: 'Delete impersonation entry',
			},
		],
		default: 'getSettings',
	},
];

export const emailSecurityFields: INodeProperties[] = [
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['emailSecurity'],
			},
		},
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com',
		description: 'The domain name',
		displayOptions: {
			show: {
				resource: ['emailSecurity'],
				operation: ['createTrustedDomain', 'deleteTrustedDomain'],
			},
		},
	},
	{
		displayName: 'Entry ID',
		name: 'entryId',
		type: 'string',
		required: true,
		default: '',
		description: 'The impersonation registry entry ID',
		displayOptions: {
			show: {
				resource: ['emailSecurity'],
				operation: ['deleteImpersonationEntry'],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'executive@example.com',
		description: 'Email address to protect from impersonation',
		displayOptions: {
			show: {
				resource: ['emailSecurity'],
				operation: ['createImpersonationEntry'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'John Doe',
		description: 'Display name of the protected person',
		displayOptions: {
			show: {
				resource: ['emailSecurity'],
				operation: ['createImpersonationEntry'],
			},
		},
	},
];
