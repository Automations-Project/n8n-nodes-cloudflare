import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const originCaOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['certificate'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an Origin CA certificate',
				action: 'Create a certificate',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get certificate details',
				action: 'Get a certificate',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List Origin CA certificates',
				action: 'List certificates',
			},
			{
				name: 'Revoke',
				value: 'revoke',
				description: 'Revoke a certificate',
				action: 'Revoke a certificate',
			},
		],
		default: 'getMany',
	},
];

export const originCaFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Certificate ID',
		name: 'certificateId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the certificate',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['get', 'revoke'],
			},
		},
	},
	{
		displayName: 'Hostnames',
		name: 'hostnames',
		type: 'string',
		required: true,
		default: '',
		placeholder: '*.example.com,example.com',
		description: 'Comma-separated list of hostnames for the certificate',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Request Type',
		name: 'requestType',
		type: 'options',
		options: [
			{ name: 'Origin RSA', value: 'origin-rsa' },
			{ name: 'Origin ECC', value: 'origin-ecc' },
			{ name: 'Keyless Certificate', value: 'keyless-certificate' },
		],
		default: 'origin-rsa',
		required: true,
		description: 'Type of certificate to create',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Validity Days',
		name: 'validityDays',
		type: 'options',
		options: [
			{ name: '7 Days', value: 7 },
			{ name: '30 Days', value: 30 },
			{ name: '90 Days', value: 90 },
			{ name: '365 Days (1 Year)', value: 365 },
			{ name: '730 Days (2 Years)', value: 730 },
			{ name: '1095 Days (3 Years)', value: 1095 },
			{ name: '5475 Days (15 Years)', value: 5475 },
		],
		default: 5475,
		required: true,
		description: 'Certificate validity period',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'CSR',
		name: 'csr',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		default: '',
		description: 'Certificate Signing Request (leave empty for Cloudflare to generate)',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['certificate'],
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
				resource: ['certificate'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
