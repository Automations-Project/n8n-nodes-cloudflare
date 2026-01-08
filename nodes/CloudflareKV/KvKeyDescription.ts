import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const kvKeyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['key'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a key from the namespace',
				action: 'Delete a key',
			},
			{
				name: 'Delete Many',
				value: 'deleteMany',
				description: 'Delete multiple keys from the namespace',
				action: 'Delete multiple keys',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List keys in a namespace',
				action: 'List keys',
			},
			{
				name: 'Read',
				value: 'read',
				description: 'Read a value from a key',
				action: 'Read a key value',
			},
			{
				name: 'Write',
				value: 'write',
				description: 'Write a value to a key',
				action: 'Write a key value',
			},
			{
				name: 'Write Many',
				value: 'writeMany',
				description: 'Write multiple key-value pairs',
				action: 'Write multiple key values',
			},
		],
		default: 'read',
	},
];

export const kvKeyFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['key'],
			},
		},
	},

	// ===========================================
	//         Namespace ID
	// ===========================================
	// ===========================================
	//         Namespace ID
	// ===========================================
	{
		displayName: 'Namespace Name or ID',
		name: 'namespaceId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKvNamespaces',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'KV Namespace ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['key'],
			},
		},
	},

	// ===========================================
	//         Key Name (for read, write, delete)
	// ===========================================
	{
		displayName: 'Key Name',
		name: 'keyName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'my-key',
		description: 'Name of the key',
		displayOptions: {
			show: {
				resource: ['key'],
				operation: ['read', 'write', 'delete'],
			},
		},
	},

	// ===========================================
	//         Write fields
	// ===========================================
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		required: true,
		default: '',
		description: 'Value to store for the key',
		displayOptions: {
			show: {
				resource: ['key'],
				operation: ['write'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'writeOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['key'],
				operation: ['write'],
			},
		},
		options: [
			{
				displayName: 'Expiration TTL (Seconds)',
				name: 'expiration_ttl',
				type: 'number',
				default: 0,
				description: 'Time to live in seconds (0 = no expiration)',
			},
			{
				displayName: 'Metadata (JSON)',
				name: 'metadata',
				type: 'string',
				default: '',
				placeholder: '{"key": "value"}',
				description: 'JSON metadata to attach to the key',
			},
		],
	},

	// ===========================================
	//         Write Many fields
	// ===========================================
	{
		displayName: 'Key-Value Pairs (JSON)',
		name: 'kvPairs',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		required: true,
		default: '',
		placeholder: '[{"key": "key1", "value": "value1"}, {"key": "key2", "value": "value2"}]',
		description: 'JSON array of key-value pairs to write',
		displayOptions: {
			show: {
				resource: ['key'],
				operation: ['writeMany'],
			},
		},
	},

	// ===========================================
	//         Delete Many fields
	// ===========================================
	{
		displayName: 'Keys to Delete',
		name: 'keysToDelete',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'key1, key2, key3',
		description: 'Comma-separated list of keys to delete',
		displayOptions: {
			show: {
				resource: ['key'],
				operation: ['deleteMany'],
			},
		},
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
				resource: ['key'],
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
				resource: ['key'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'keyFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['key'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Prefix',
				name: 'prefix',
				type: 'string',
				default: '',
				description: 'Filter keys by prefix',
			},
		],
	},
];
