import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const dnsRecordOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dnsRecord'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a DNS record',
				action: 'Create a DNS record',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a DNS record',
				action: 'Delete a DNS record',
			},
			{
				name: 'Export',
				value: 'export',
				description: 'Export zone DNS records to BIND format',
				action: 'Export DNS records',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a DNS record',
				action: 'Get a DNS record',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many DNS records',
				action: 'Get many DNS records',
			},
			{
				name: 'Import',
				value: 'import',
				description: 'Import DNS records from BIND format',
				action: 'Import DNS records',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a DNS record',
				action: 'Update a DNS record',
			},
		],
		default: 'getMany',
	},
];

export const dnsRecordFields: INodeProperties[] = [
	// ===========================================
	//         Zone ID (common for all operations)
	// ===========================================
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['dnsRecord'],
			},
		},
	},

	// ===========================================
	//         DNS Record ID (for get, delete, update)
	// ===========================================
	{
		displayName: 'Record ID',
		name: 'recordId',
		type: 'string',
		required: true,
		default: '',
		description: 'The DNS Record ID',
		displayOptions: {
			show: {
				resource: ['dnsRecord'],
				operation: ['get', 'delete', 'update'],
			},
		},
	},

	// ===========================================
	//         Create / Update fields
	// ===========================================
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['dnsRecord'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'A', value: 'A' },
			{ name: 'AAAA', value: 'AAAA' },
			{ name: 'CNAME', value: 'CNAME' },
			{ name: 'TXT', value: 'TXT' },
			{ name: 'MX', value: 'MX' },
			{ name: 'NS', value: 'NS' },
			{ name: 'SRV', value: 'SRV' },
			{ name: 'CAA', value: 'CAA' },
			{ name: 'PTR', value: 'PTR' },
		],
		default: 'A',
		description: 'DNS record type',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com or subdomain',
		description: 'DNS record name (or @ for the zone apex)',
		displayOptions: {
			show: {
				resource: ['dnsRecord'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		required: true,
		default: '',
		placeholder: '192.0.2.1',
		description: 'DNS record content (IP address, hostname, or text value)',
		displayOptions: {
			show: {
				resource: ['dnsRecord'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['dnsRecord'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'TTL',
				name: 'ttl',
				type: 'number',
				default: 1,
				description: 'Time to live in seconds. 1 = Auto.',
			},
			{
				displayName: 'Proxied',
				name: 'proxied',
				type: 'boolean',
				default: false,
				description: 'Whether the record is proxied through Cloudflare',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				default: 10,
				description: 'Priority for MX and SRV records',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				description: 'Comments or notes about the DNS record',
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
				resource: ['dnsRecord'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				description: 'Comments or notes about the DNS record',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				description: 'DNS record content',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'DNS record name',
			},
			{
				displayName: 'Proxied',
				name: 'proxied',
				type: 'boolean',
				default: false,
				description: 'Whether the record is proxied through Cloudflare',
			},
			{
				displayName: 'TTL',
				name: 'ttl',
				type: 'number',
				default: 1,
				description: 'Time to live in seconds',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'A', value: 'A' },
					{ name: 'AAAA', value: 'AAAA' },
					{ name: 'CNAME', value: 'CNAME' },
					{ name: 'TXT', value: 'TXT' },
					{ name: 'MX', value: 'MX' },
					{ name: 'NS', value: 'NS' },
					{ name: 'SRV', value: 'SRV' },
					{ name: 'CAA', value: 'CAA' },
					{ name: 'PTR', value: 'PTR' },
				],
				default: 'A',
				description: 'DNS record type',
			},
		],
	},

	// ===========================================
	//         Get Many filters
	// ===========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['dnsRecord'],
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
				resource: ['dnsRecord'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['dnsRecord'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by record name (exact match)',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'All Types', value: '' },
					{ name: 'A', value: 'A' },
					{ name: 'AAAA', value: 'AAAA' },
					{ name: 'CNAME', value: 'CNAME' },
					{ name: 'TXT', value: 'TXT' },
					{ name: 'MX', value: 'MX' },
					{ name: 'NS', value: 'NS' },
					{ name: 'SRV', value: 'SRV' },
				],
				default: '',
				description: 'Filter by record type',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				description: 'Filter by record content (exact match)',
			},
			{
				displayName: 'Proxied',
				name: 'proxied',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by proxied status',
			},
		],
	},

	// ===========================================
	//         Import fields
	// ===========================================
	{
		displayName: 'BIND Zone Content',
		name: 'bindContent',
		type: 'string',
		required: true,
		default: '',
		typeOptions: {
			rows: 10,
		},
		placeholder: 'example.com. 300 IN A 192.0.2.1',
		description: 'DNS records in BIND zone file format',
		displayOptions: {
			show: {
				resource: ['dnsRecord'],
				operation: ['import'],
			},
		},
	},
];
