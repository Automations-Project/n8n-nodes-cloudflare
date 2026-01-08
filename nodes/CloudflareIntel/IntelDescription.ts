import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const intelOperations: INodeProperties[] = [
	// IP resource operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ip'],
			},
		},
		options: [
			{
				name: 'Get Details',
				value: 'get',
				description: 'Get IP intelligence details',
				action: 'Get IP details',
			},
			{
				name: 'Get List',
				value: 'getList',
				description: 'Get IP list details',
				action: 'Get IP list details',
			},
		],
		default: 'get',
	},
	// Domain resource operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['domain'],
			},
		},
		options: [
			{
				name: 'Get Details',
				value: 'get',
				description: 'Get Domain intelligence details',
				action: 'Get domain details',
			},
			{
				name: 'Get Bulk',
				value: 'getBulk',
				description: 'Get bulk domain intelligence',
				action: 'Get bulk domain details',
			},
			{
				name: 'Get History',
				value: 'getHistory',
				description: 'Get domain history',
				action: 'Get domain history',
			},
		],
		default: 'get',
	},
	// ASN resource operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['asn'],
			},
		},
		options: [
			{
				name: 'Get Details',
				value: 'get',
				description: 'Get ASN intelligence details',
				action: 'Get ASN details',
			},
			{
				name: 'Get Subnets',
				value: 'getSubnets',
				description: 'Get subnets for an ASN',
				action: 'Get ASN subnets',
			},
		],
		default: 'get',
	},
	// WHOIS resource operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['whois'],
			},
		},
		options: [
			{
				name: 'Get Details',
				value: 'get',
				description: 'Get WHOIS information',
				action: 'Get WHOIS details',
			},
		],
		default: 'get',
	},
];

export const intelFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
	},

	// ===========================================
	//         IP Resource Fields
	// ===========================================
	{
		displayName: 'IP Address',
		name: 'ip',
		type: 'string',
		required: true,
		default: '',
		placeholder: '192.0.2.1 or 2001:db8::1',
		description: 'IPv4 or IPv6 address to lookup',
		displayOptions: {
			show: {
				resource: ['ip'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'IP List Name or ID',
		name: 'ipListId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the IP list to get details for',
		displayOptions: {
			show: {
				resource: ['ip'],
				operation: ['getList'],
			},
		},
	},

	// ===========================================
	//         Domain Resource Fields
	// ===========================================
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com',
		description: 'Domain name to lookup',
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['get', 'getHistory'],
			},
		},
	},
	{
		displayName: 'Domains',
		name: 'domains',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com,example.org,example.net',
		description: 'Comma-separated list of domains to lookup',
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['getBulk'],
			},
		},
	},

	// ===========================================
	//         ASN Resource Fields
	// ===========================================
	{
		displayName: 'ASN',
		name: 'asn',
		type: 'number',
		required: true,
		default: 0,
		placeholder: '13335',
		description: 'Autonomous System Number to lookup',
		displayOptions: {
			show: {
				resource: ['asn'],
				operation: ['get', 'getSubnets'],
			},
		},
	},

	// ===========================================
	//         WHOIS Resource Fields
	// ===========================================
	{
		displayName: 'Domain',
		name: 'whoisDomain',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com',
		description: 'Domain name to get WHOIS information for',
		displayOptions: {
			show: {
				resource: ['whois'],
				operation: ['get'],
			},
		},
	},
];
