import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const loadBalancerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['loadBalancer'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a load balancer',
				action: 'Create a load balancer',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a load balancer',
				action: 'Delete a load balancer',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a load balancer',
				action: 'Get a load balancer',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List load balancers',
				action: 'List load balancers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a load balancer',
				action: 'Update a load balancer',
			},
		],
		default: 'getMany',
	},
];

export const loadBalancerFields: INodeProperties[] = [
	// ===========================================
	//         Zone ID
	// ===========================================
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['loadBalancer'],
			},
		},
	},

	// ===========================================
	//         Load Balancer ID
	// ===========================================
	{
		displayName: 'Load Balancer ID',
		name: 'loadBalancerId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the load balancer',
		displayOptions: {
			show: {
				resource: ['loadBalancer'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},

	// ===========================================
	//         Get Many Options
	// ===========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['loadBalancer'],
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
				resource: ['loadBalancer'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},

	// ===========================================
	//         Create fields
	// ===========================================
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'www.example.com',
		description: 'The DNS hostname to associate with your load balancer',
		displayOptions: {
			show: {
				resource: ['loadBalancer'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Default Pools',
		name: 'defaultPools',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'pool-ID-1,pool-ID-2',
		description: 'Comma-separated list of pool IDs ordered by failover priority',
		displayOptions: {
			show: {
				resource: ['loadBalancer'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Fallback Pool',
		name: 'fallbackPool',
		type: 'string',
		required: true,
		default: '',
		description: 'Pool ID to use when all other pools are unhealthy',
		displayOptions: {
			show: {
				resource: ['loadBalancer'],
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
				resource: ['loadBalancer'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Proxied',
				name: 'proxied',
				type: 'boolean',
				default: true,
				description: 'Whether to enable Cloudflare proxy for the load balancer',
			},
			{
				displayName: 'TTL',
				name: 'ttl',
				type: 'number',
				default: 30,
				description: 'Time to live (TTL) of the DNS entry in seconds',
			},
			{
				displayName: 'Session Affinity',
				name: 'sessionAffinity',
				type: 'options',
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'Cookie', value: 'cookie' },
					{ name: 'IP Cookie', value: 'ip_cookie' },
					{ name: 'Header', value: 'header' },
				],
				default: 'none',
				description: 'Session affinity type',
			},
		],
	},

	// ===========================================
	//         Update fields
	// ===========================================
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['loadBalancer'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Default Pools',
				name: 'defaultPools',
				type: 'string',
				default: '',
				placeholder: 'pool-ID-1,pool-ID-2',
				description: 'Comma-separated list of pool IDs',
			},
			{
				displayName: 'Fallback Pool',
				name: 'fallbackPool',
				type: 'string',
				default: '',
				description: 'Pool ID to use when all others are unhealthy',
			},
			{
				displayName: 'Proxied',
				name: 'proxied',
				type: 'boolean',
				default: true,
				description: 'Whether to enable Cloudflare proxy',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the load balancer is enabled',
			},
		],
	},
];
