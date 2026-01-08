import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const originTlsClientAuthOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['originTlsClientAuth'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Upload a certificate for authenticated origin pulls',
				action: 'Create an origin TLS client auth certificate',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a certificate',
				action: 'Delete an origin TLS client auth certificate',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get certificate details',
				action: 'Get an origin TLS client auth certificate',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all certificates',
				action: 'Get many origin TLS client auth certificates',
			},
			{
				name: 'Get Settings',
				value: 'getSettings',
				description: 'Get authenticated origin pulls setting',
				action: 'Get authenticated origin pulls setting',
			},
			{
				name: 'Update Settings',
				value: 'updateSettings',
				description: 'Enable or disable authenticated origin pulls',
				action: 'Update authenticated origin pulls setting',
			},
		],
		default: 'getMany',
	},
];

export const originTlsClientAuthFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['originTlsClientAuth'],
			},
		},
	},
	{
		displayName: 'Certificate ID',
		name: 'certificateId',
		type: 'string',
		required: true,
		default: '',
		description: 'The certificate identifier',
		displayOptions: {
			show: {
				resource: ['originTlsClientAuth'],
				operation: ['delete', 'get'],
			},
		},
	},
	{
		displayName: 'Certificate (PEM)',
		name: 'certificate',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		required: true,
		default: '',
		placeholder: '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----',
		description: 'The zone\'s leaf certificate in PEM format',
		displayOptions: {
			show: {
				resource: ['originTlsClientAuth'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Private Key (PEM)',
		name: 'privateKey',
		type: 'string',
		typeOptions: {
			rows: 5,
			password: true,
		},
		required: true,
		default: '',
		placeholder: '-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----',
		description: 'The zone\'s private key in PEM format',
		displayOptions: {
			show: {
				resource: ['originTlsClientAuth'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		required: true,
		description: 'Whether to enable authenticated origin pulls',
		displayOptions: {
			show: {
				resource: ['originTlsClientAuth'],
				operation: ['updateSettings'],
			},
		},
	},
];
