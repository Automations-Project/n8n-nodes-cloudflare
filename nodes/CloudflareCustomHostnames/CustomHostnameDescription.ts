import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const customHostnameOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customHostname'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a custom hostname',
				action: 'Create a custom hostname',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a custom hostname',
				action: 'Delete a custom hostname',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get custom hostname details',
				action: 'Get a custom hostname',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List custom hostnames',
				action: 'List custom hostnames',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a custom hostname',
				action: 'Update a custom hostname',
			},
		],
		default: 'getMany',
	},
];

export const customHostnameFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['customHostname'],
			},
		},
	},
	{
		displayName: 'Custom Hostname ID',
		name: 'customHostnameId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the custom hostname',
		displayOptions: {
			show: {
				resource: ['customHostname'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Hostname',
		name: 'hostname',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'app.customer.com',
		description: 'Custom hostname to create',
		displayOptions: {
			show: {
				resource: ['customHostname'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'SSL Method',
		name: 'sslMethod',
		type: 'options',
		options: [
			{ name: 'CNAME', value: 'cname' },
			{ name: 'Email', value: 'email' },
			{ name: 'HTTP', value: 'http' },
			{ name: 'TXT', value: 'txt' },
		],
		default: 'http',
		required: true,
		description: 'SSL certificate validation method',
		displayOptions: {
			show: {
				resource: ['customHostname'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'SSL Type',
		name: 'sslType',
		type: 'options',
		options: [
			{ name: 'DV (Domain Validated)', value: 'dv' },
		],
		default: 'dv',
		description: 'SSL certificate type',
		displayOptions: {
			show: {
				resource: ['customHostname'],
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
				resource: ['customHostname'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Bundle Method',
				name: 'bundle_method',
				type: 'options',
				options: [
					{ name: 'Force', value: 'force' },
					{ name: 'Optimal', value: 'optimal' },
					{ name: 'Ubiquitous', value: 'ubiquitous' },
				],
				default: 'ubiquitous',
				description: 'SSL certificate bundle method',
			},
			{
				displayName: 'Custom Origin Server',
				name: 'custom_origin_server',
				type: 'string',
				default: '',
				description: 'Origin server for this custom hostname',
			},
			{
				displayName: 'Custom Origin SNI',
				name: 'custom_origin_sni',
				type: 'string',
				default: '',
				description: 'SNI value for the origin',
			},
			{
				displayName: 'Wildcard',
				name: 'wildcard',
				type: 'boolean',
				default: false,
				description: 'Whether to enable wildcard for this hostname',
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
				resource: ['customHostname'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Custom Origin Server',
				name: 'custom_origin_server',
				type: 'string',
				default: '',
				description: 'Origin server for this custom hostname',
			},
			{
				displayName: 'SSL Method',
				name: 'ssl_method',
				type: 'options',
				options: [
					{ name: 'CNAME', value: 'cname' },
					{ name: 'Email', value: 'email' },
					{ name: 'HTTP', value: 'http' },
					{ name: 'TXT', value: 'txt' },
				],
				default: 'http',
				description: 'SSL certificate validation method',
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
				resource: ['customHostname'],
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
				resource: ['customHostname'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
