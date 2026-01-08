import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const clientCertificateOperations: INodeProperties[] = [
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
				description: 'Create a client certificate',
				action: 'Create a client certificate',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a client certificate',
				action: 'Delete a client certificate',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get certificate details',
				action: 'Get a client certificate',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List client certificates',
				action: 'List client certificates',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a client certificate',
				action: 'Update a client certificate',
			},
		],
		default: 'getMany',
	},
];

export const clientCertificateFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['certificate'],
			},
		},
	},
	{
		displayName: 'Certificate ID',
		name: 'certificateId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the client certificate',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Validity Days',
		name: 'validityDays',
		type: 'options',
		options: [
			{ name: '1 Day', value: 1 },
			{ name: '7 Days', value: 7 },
			{ name: '30 Days', value: 30 },
			{ name: '90 Days', value: 90 },
			{ name: '1 Year', value: 365 },
			{ name: '3 Years', value: 1095 },
			{ name: '15 Years', value: 5475 },
		],
		default: 365,
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
		description: 'Certificate Signing Request (PEM format). Leave empty for Cloudflare to generate.',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Revoke',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Revoked', value: 'revoked' },
				],
				default: 'active',
				description: 'Certificate status',
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
