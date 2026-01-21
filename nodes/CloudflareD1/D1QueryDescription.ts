import { INodeProperties } from 'n8n-workflow';

export const d1QueryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['query'],
			},
		},
		options: [
			{
				name: 'Execute',
				value: 'execute',
				description: 'Execute a SQL query',
				action: 'Execute a SQL query',
			},
			{
				name: 'Execute Raw',
				value: 'executeRaw',
				description: 'Execute raw SQL statements',
				action: 'Execute raw SQL',
			},
		],
		default: 'execute',
	},
];

export const d1QueryFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		displayName: 'Account Name or ID',
		name: 'accountId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAccounts',
		},
		required: true,
		default: '',
		description: 'Cloudflare Account ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['query'],
			},
		},
	},

	// ===========================================
	//         Database ID
	// ===========================================
	{
		displayName: 'Database Name or ID',
		name: 'databaseId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getD1Databases',
			loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'ID of the D1 database to query. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['query'],
			},
		},
	},

	// ===========================================
	//         SQL Query
	// ===========================================
	{
		displayName: 'SQL',
		name: 'sql',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		required: true,
		default: '',
		placeholder: 'SELECT * FROM users WHERE id = ?1',
		description: 'SQL query to execute. Use ?1, ?2, etc. for positional parameters.',
		displayOptions: {
			show: {
				resource: ['query'],
			},
		},
	},

	// ===========================================
	//         Parameters
	// ===========================================
	{
		displayName: 'Parameters',
		name: 'params',
		type: 'string',
		default: '',
		placeholder: '["value1", 123, true]',
		description: 'JSON array of parameter values to bind to the query',
		displayOptions: {
			show: {
				resource: ['query'],
				operation: ['execute'],
			},
		},
	},

	// ===========================================
	//         Options
	// ===========================================
	{
		displayName: 'Options',
		name: 'queryOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['query'],
			},
		},
		options: [
			{
				displayName: 'Return Metadata',
				name: 'returnMetadata',
				type: 'boolean',
				default: false,
				description: 'Whether to include query metadata (rows affected, duration, etc.)',
			},
		],
	},
];
