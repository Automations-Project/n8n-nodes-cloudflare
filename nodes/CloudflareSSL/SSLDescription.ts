import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const sslOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['universalSslSettings'],
			},
		},
		options: [
			{
				name: 'Analyze',
				value: 'analyze',
				description: 'Analyze certificate for a zone',
				action: 'Analyze SSL certificate',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get Universal SSL settings',
				action: 'Get universal ssl settings',
			},
			{
				name: 'Get Verification',
				value: 'getVerification',
				description: 'Get SSL verification info',
				action: 'Get SSL verification info',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update Universal SSL settings',
				action: 'Update universal ssl settings',
			},
		],
		default: 'get',
	},
];

export const sslFields: INodeProperties[] = [
	// ===========================================
	//         Zone ID
	// ===========================================
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['universalSslSettings'],
			},
		},
	},

	// ===========================================
	//         Update Options
	// ===========================================
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		required: true,
		description: 'Whether Universal SSL is enabled',
		displayOptions: {
			show: {
				resource: ['universalSslSettings'],
				operation: ['update'],
			},
		},
	},

	// ===========================================
	//         Analyze Options
	// ===========================================
	{
		displayName: 'Bundle Method',
		name: 'bundleMethod',
		type: 'options',
		options: [
			{ name: 'Ubiquitous', value: 'ubiquitous' },
			{ name: 'Optimal', value: 'optimal' },
			{ name: 'Force', value: 'force' },
		],
		default: 'ubiquitous',
		description: 'Certificate bundle method',
		displayOptions: {
			show: {
				resource: ['universalSslSettings'],
				operation: ['analyze'],
			},
		},
	},
	{
		displayName: 'Certificate (PEM)',
		name: 'certificate',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		default: '',
		placeholder: '-----BEGIN CERTIFICATE-----',
		description: 'Certificate content in PEM format',
		displayOptions: {
			show: {
				resource: ['universalSslSettings'],
				operation: ['analyze'],
			},
		},
	},
];
