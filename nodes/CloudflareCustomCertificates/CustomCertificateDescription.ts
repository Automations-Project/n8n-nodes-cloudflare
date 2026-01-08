import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const customCertificateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customCertificate'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Upload a custom SSL certificate',
				action: 'Create a custom certificate',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a custom certificate',
				action: 'Delete a custom certificate',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get custom certificate details',
				action: 'Get a custom certificate',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List custom certificates',
				action: 'Get many custom certificates',
			},
			{
				name: 'Prioritize',
				value: 'prioritize',
				description: 'Set the priority order for custom certificates',
				action: 'Prioritize custom certificates',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a custom certificate',
				action: 'Update a custom certificate',
			},
		],
		default: 'getMany',
	},
];

export const customCertificateFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['customCertificate'],
			},
		},
	},
	{
		displayName: 'Certificate ID',
		name: 'certificateId',
		type: 'string',
		required: true,
		default: '',
		description: 'The custom certificate identifier',
		displayOptions: {
			show: {
				resource: ['customCertificate'],
				operation: ['delete', 'get', 'update'],
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
		required: true,
		default: '',
		placeholder: '-----BEGIN CERTIFICATE-----...',
		description: 'SSL certificate in PEM format',
		displayOptions: {
			show: {
				resource: ['customCertificate'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Private Key (PEM)',
		name: 'privateKey',
		type: 'string',
		typeOptions: {
			rows: 10,
			password: true,
		},
		required: true,
		default: '',
		placeholder: '-----BEGIN PRIVATE KEY-----...',
		description: 'Private key in PEM format',
		displayOptions: {
			show: {
				resource: ['customCertificate'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Create Options',
		name: 'createOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['customCertificate'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Bundle Method',
				name: 'bundle_method',
				type: 'options',
				options: [
					{ name: 'Ubiquitous', value: 'ubiquitous' },
					{ name: 'Optimal', value: 'optimal' },
					{ name: 'Force', value: 'force' },
				],
				default: 'ubiquitous',
				description: 'Certificate bundle method',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Legacy Custom', value: 'legacy_custom' },
					{ name: 'SNI Custom', value: 'sni_custom' },
				],
				default: 'legacy_custom',
				description: 'Certificate type',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['customCertificate'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Bundle Method',
				name: 'bundle_method',
				type: 'options',
				options: [
					{ name: 'Ubiquitous', value: 'ubiquitous' },
					{ name: 'Optimal', value: 'optimal' },
					{ name: 'Force', value: 'force' },
				],
				default: 'ubiquitous',
				description: 'Certificate bundle method',
			},
			{
				displayName: 'Certificate (PEM)',
				name: 'certificate',
				type: 'string',
				typeOptions: { rows: 10 },
				default: '',
				description: 'New SSL certificate',
			},
			{
				displayName: 'Private Key (PEM)',
				name: 'private_key',
				type: 'string',
				typeOptions: { rows: 10, password: true },
				default: '',
				description: 'New private key',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['customCertificate'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['customCertificate'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Certificates (JSON)',
		name: 'certificatesJson',
		type: 'json',
		required: true,
		default: '[]',
		placeholder: '[{"ID": "cert_id_1", "priority": 1}, {"ID": "cert_id_2", "priority": 2}]',
		description: 'Array of certificate IDs with their priority (1 = highest)',
		displayOptions: {
			show: {
				resource: ['customCertificate'],
				operation: ['prioritize'],
			},
		},
	},
];
