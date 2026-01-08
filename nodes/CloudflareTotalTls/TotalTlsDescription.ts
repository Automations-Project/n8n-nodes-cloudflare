import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const totalTlsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['totalTls'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get Total TLS settings',
				action: 'Get total tls settings',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Enable or disable Total TLS',
				action: 'Update total tls settings',
			},
		],
		default: 'get',
	},
];

export const totalTlsFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['totalTls'],
			},
		},
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		required: true,
		description: 'Whether Total TLS is enabled',
		displayOptions: {
			show: {
				resource: ['totalTls'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Certificate Authority',
		name: 'certificateAuthority',
		type: 'options',
		options: [
			{ name: 'Google', value: 'google' },
			{ name: "Let's Encrypt", value: 'lets_encrypt' },
		],
		default: 'google',
		description: 'The certificate authority to use',
		displayOptions: {
			show: {
				resource: ['totalTls'],
				operation: ['update'],
			},
		},
	},
];
