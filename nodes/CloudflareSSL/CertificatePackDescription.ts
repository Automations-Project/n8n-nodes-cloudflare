import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const certificatePackOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['certificatePack'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Order an advanced certificate pack',
				action: 'Create a certificate pack',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an advanced certificate pack',
				action: 'Delete a certificate pack',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get certificate pack details',
				action: 'Get a certificate pack',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List certificate packs',
				action: 'Get many certificate packs',
			},
			{
				name: 'Get Quota',
				value: 'getQuota',
				description: 'Get certificate pack quota',
				action: 'Get certificate pack quota',
			},
		],
		default: 'getMany',
	},
];

export const certificatePackFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['certificatePack'],
			},
		},
	},
	{
		displayName: 'Certificate Pack ID',
		name: 'certificatePackId',
		type: 'string',
		required: true,
		default: '',
		description: 'The certificate pack identifier',
		displayOptions: {
			show: {
				resource: ['certificatePack'],
				operation: ['delete', 'get'],
			},
		},
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Advanced', value: 'advanced' },
		],
		default: 'advanced',
		required: true,
		description: 'Certificate pack type',
		displayOptions: {
			show: {
				resource: ['certificatePack'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Hosts (Comma Separated)',
		name: 'hosts',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com, *.example.com',
		description: 'Comma-separated list of hostnames',
		displayOptions: {
			show: {
				resource: ['certificatePack'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Validation Method',
		name: 'validationMethod',
		type: 'options',
		options: [
			{ name: 'TXT', value: 'txt' },
			{ name: 'HTTP', value: 'http' },
			{ name: 'Email', value: 'email' },
		],
		default: 'txt',
		required: true,
		description: 'Domain control validation method',
		displayOptions: {
			show: {
				resource: ['certificatePack'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Validity Days',
		name: 'validityDays',
		type: 'options',
		options: [
			{ name: '14 Days', value: 14 },
			{ name: '30 Days', value: 30 },
			{ name: '90 Days', value: 90 },
			{ name: '1 Year (365 Days)', value: 365 },
		],
		default: 90,
		required: true,
		description: 'Certificate validity period',
		displayOptions: {
			show: {
				resource: ['certificatePack'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Certificate Authority',
		name: 'certificateAuthority',
		type: 'options',
		options: [
			{ name: 'DigiCert', value: 'digicert' },
			{ name: "Let's Encrypt", value: 'lets_encrypt' },
			{ name: 'Google', value: 'google' },
		],
		default: 'digicert',
		required: true,
		description: 'Certificate authority to use',
		displayOptions: {
			show: {
				resource: ['certificatePack'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Active', value: 'active' },
		],
		default: 'all',
		description: 'Filter by status',
		displayOptions: {
			show: {
				resource: ['certificatePack'],
				operation: ['getMany'],
			},
		},
	},
];
