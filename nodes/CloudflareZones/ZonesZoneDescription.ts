import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const zonesZoneOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['zone'],
			},
		},
		options: [
			{
				name: 'Activation Check',
				value: 'activationCheck',
				description: 'Check zone activation status',
				action: 'Check zone activation',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new zone',
				action: 'Create a zone',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a zone',
				action: 'Delete a zone',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get zone details',
				action: 'Get a zone',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all zones',
				action: 'List zones',
			},
		],
		default: 'getMany',
	},
];

export const zonesZoneFields: INodeProperties[] = [
	// ===========================================
	//         Zone ID (for get, delete, activationCheck)
	// ===========================================
	{
		displayName: 'Zone Name or ID',
		name: 'zoneId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getZones',
		},
		required: true,
		default: '',
		description: 'Zone ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['zone'],
				operation: ['get', 'delete', 'activationCheck'],
			},
		},
	},

	// ===========================================
	//         Create fields
	// ===========================================
	{
		displayName: 'Domain Name',
		name: 'domainName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com',
		description: 'The domain name for the zone',
		displayOptions: {
			show: {
				resource: ['zone'],
				operation: ['create'],
			},
		},
	},
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['zone'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'zoneOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['zone'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Full', value: 'full' },
					{ name: 'Partial (CNAME)', value: 'partial' },
					{ name: 'Secondary', value: 'secondary' },
				],
				default: 'full',
				description: 'Zone type',
			},
			{
				displayName: 'Jump Start',
				name: 'jumpStart',
				type: 'boolean',
				default: false,
				description: 'Whether to automatically scan for DNS records',
			},
		],
	},

	// ===========================================
	//         Get Many options
	// ===========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['zone'],
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
				resource: ['zone'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'zoneFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['zone'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by zone name (domain)',
			},
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				default: '',
				description: 'Filter by account ID',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Active', value: 'active' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Initializing', value: 'initializing' },
					{ name: 'Moved', value: 'moved' },
					{ name: 'Deleted', value: 'deleted' },
				],
				default: '',
				description: 'Filter by zone status',
			},
		],
	},
];
