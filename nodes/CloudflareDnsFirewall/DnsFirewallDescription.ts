import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const dnsFirewallOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dnsFirewall'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a DNS Firewall cluster',
				action: 'Create a dns firewall cluster',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a DNS Firewall cluster',
				action: 'Delete a dns firewall cluster',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a DNS Firewall cluster',
				action: 'Get a dns firewall cluster',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List DNS Firewall clusters',
				action: 'Get many dns firewall clusters',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a DNS Firewall cluster',
				action: 'Update a dns firewall cluster',
			},
		],
		default: 'getMany',
	},
];

export const dnsFirewallFields: INodeProperties[] = [
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['dnsFirewall'],
			},
		},
	},
	{
		displayName: 'Cluster ID',
		name: 'clusterId',
		type: 'string',
		required: true,
		default: '',
		description: 'The DNS Firewall cluster identifier',
		displayOptions: {
			show: {
				resource: ['dnsFirewall'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'My DNS Firewall',
		description: 'DNS Firewall cluster name',
		displayOptions: {
			show: {
				resource: ['dnsFirewall'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Upstream IPs (Comma Separated)',
		name: 'upstreamIps',
		type: 'string',
		required: true,
		default: '',
		placeholder: '1.2.3.4, 5.6.7.8',
		description: 'Comma-separated upstream DNS server IPs',
		displayOptions: {
			show: {
				resource: ['dnsFirewall'],
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
				resource: ['dnsFirewall'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Attack Mitigation',
				name: 'attack_mitigation',
				type: 'json',
				default: '{"enabled": true}',
				description: 'Attack mitigation settings',
			},
			{
				displayName: 'Deprecate ANY Requests',
				name: 'deprecate_any_requests',
				type: 'boolean',
				default: true,
				description: 'Whether to deprecate ANY queries for improved DDoS protection',
			},
			{
				displayName: 'Maximum Cache TTL',
				name: 'maximum_cache_ttl',
				type: 'number',
				default: 14400,
				description: 'Maximum cache TTL in seconds',
			},
			{
				displayName: 'Minimum Cache TTL',
				name: 'minimum_cache_ttl',
				type: 'number',
				default: 30,
				description: 'Minimum cache TTL in seconds',
			},
			{
				displayName: 'Negative Cache TTL',
				name: 'negative_cache_ttl',
				type: 'number',
				default: null,
				description: 'Negative cache TTL in seconds',
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
				resource: ['dnsFirewall'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Attack Mitigation',
				name: 'attack_mitigation',
				type: 'json',
				default: '{}',
				description: 'Attack mitigation settings',
			},
			{
				displayName: 'Deprecate ANY Requests',
				name: 'deprecate_any_requests',
				type: 'boolean',
				default: true,
				description: 'Whether to deprecate ANY queries',
			},
			{
				displayName: 'Maximum Cache TTL',
				name: 'maximum_cache_ttl',
				type: 'number',
				default: 14400,
				description: 'Maximum cache TTL in seconds',
			},
			{
				displayName: 'Minimum Cache TTL',
				name: 'minimum_cache_ttl',
				type: 'number',
				default: 30,
				description: 'Minimum cache TTL in seconds',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Cluster name',
			},
			{
				displayName: 'Upstream IPs (Comma Separated)',
				name: 'upstream_ips',
				type: 'string',
				default: '',
				description: 'Comma-separated upstream DNS server IPs',
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
				resource: ['dnsFirewall'],
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
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['dnsFirewall'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
