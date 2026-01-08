import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const spectrumOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['app'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a Spectrum app',
				action: 'Create an app',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a Spectrum app',
				action: 'Delete an app',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get Spectrum app details',
				action: 'Get an app',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List Spectrum apps',
				action: 'Get many apps',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a Spectrum app',
				action: 'Update an app',
			},
		],
		default: 'getMany',
	},
];

export const spectrumFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['app'],
			},
		},
	},
	{
		displayName: 'App ID',
		name: 'appId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the Spectrum app',
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Protocol',
		name: 'protocol',
		type: 'options',
		options: [
			{ name: 'SSH', value: 'tcp/22' },
			{ name: 'HTTP', value: 'tcp/80' },
			{ name: 'HTTPS', value: 'tcp/443' },
			{ name: 'Minecraft', value: 'tcp/25565' },
			{ name: 'RDP', value: 'tcp/3389' },
			{ name: 'Custom TCP', value: 'tcp' },
			{ name: 'Custom UDP', value: 'udp' },
		],
		default: 'tcp/443',
		required: true,
		description: 'Protocol and port for the Spectrum app',
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'DNS Name',
		name: 'dnsName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'spectrum.example.com',
		description: 'DNS name for the Spectrum app',
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Origin DNS',
		name: 'originDns',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'origin.example.com',
		description: 'DNS name of the origin server',
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Origin Port',
		name: 'originPort',
		type: 'number',
		required: true,
		default: 443,
		description: 'Port on the origin server',
		displayOptions: {
			show: {
				resource: ['app'],
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
				resource: ['app'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Argo Smart Routing',
				name: 'argo_smart_routing',
				type: 'boolean',
				default: false,
				description: 'Whether to enable Argo Smart Routing',
			},
			{
				displayName: 'Edge IPs Connectivity',
				name: 'edge_ips_connectivity',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'IPv4', value: 'ipv4' },
					{ name: 'IPv6', value: 'ipv6' },
				],
				default: 'all',
				description: 'IP versions for edge connectivity',
			},
			{
				displayName: 'IP Firewall',
				name: 'ip_firewall',
				type: 'boolean',
				default: false,
				description: 'Whether to enable IP Firewall',
			},
			{
				displayName: 'Proxy Protocol',
				name: 'proxy_protocol',
				type: 'options',
				options: [
					{ name: 'Off', value: 'off' },
					{ name: 'V1', value: 'v1' },
					{ name: 'V2', value: 'v2' },
					{ name: 'Simple', value: 'simple' },
				],
				default: 'off',
				description: 'Proxy Protocol version',
			},
			{
				displayName: 'TLS',
				name: 'tls',
				type: 'options',
				options: [
					{ name: 'Off', value: 'off' },
					{ name: 'Flexible', value: 'flexible' },
					{ name: 'Full', value: 'full' },
					{ name: 'Strict', value: 'strict' },
				],
				default: 'off',
				description: 'TLS mode for the connection',
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
				resource: ['app'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Argo Smart Routing',
				name: 'argo_smart_routing',
				type: 'boolean',
				default: false,
				description: 'Whether to enable Argo Smart Routing',
			},
			{
				displayName: 'Origin DNS',
				name: 'origin_dns',
				type: 'string',
				default: '',
				description: 'DNS name of the origin server',
			},
			{
				displayName: 'Origin Port',
				name: 'origin_port',
				type: 'number',
				default: 443,
				description: 'Port on the origin server',
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
				resource: ['app'],
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
				resource: ['app'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
