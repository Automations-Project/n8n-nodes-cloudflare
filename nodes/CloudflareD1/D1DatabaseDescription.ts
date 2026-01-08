import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const d1DatabaseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['database'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new D1 database',
				action: 'Create a database',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a D1 database',
				action: 'Delete a database',
			},
			{
				name: 'Export',
				value: 'export',
				description: 'Export a D1 database to SQL',
				action: 'Export a database',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get database details',
				action: 'Get a database',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all D1 databases',
				action: 'List databases',
			},
			{
				name: 'Import',
				value: 'import',
				description: 'Import SQL into a D1 database',
				action: 'Import into a database',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a D1 database',
				action: 'Update a database',
			},
		],
		default: 'getMany',
	},
];

export const d1DatabaseFields: INodeProperties[] = [
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
				resource: ['database'],
			},
		},
	},

	// ===========================================
	//         Database ID (for get, delete)
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
		description: 'ID of the D1 database. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['get', 'delete', 'update', 'export', 'import'],
			},
		},
	},

	// ===========================================
	//         Create fields
	// ===========================================
	{
		displayName: 'Database Name',
		name: 'databaseName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'my-database',
		description: 'Name for the new database',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'createOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Primary Location Hint',
				name: 'primaryLocationHint',
				type: 'options',
				options: [
					{ name: 'Automatic', value: '' },
					{ name: 'Western North America (Wnam)', value: 'wnam' },
					{ name: 'Eastern North America (Enam)', value: 'enam' },
					{ name: 'Western Europe (Weur)', value: 'weur' },
					{ name: 'Eastern Europe (Eeur)', value: 'eeur' },
					{ name: 'Asia Pacific (Apac)', value: 'apac' },
				],
				default: '',
				description: 'Preferred location for the database',
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
				resource: ['database'],
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
				resource: ['database'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},

	// ===========================================
	//         Update fields
	// ===========================================
	{
		displayName: 'New Database Name',
		name: 'newDatabaseName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'my-renamed-database',
		description: 'New name for the database',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['update'],
			},
		},
	},

	// ===========================================
	//         Export options
	// ===========================================
	{
		displayName: 'Export Options',
		name: 'exportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['export'],
			},
		},
		options: [
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				options: [
					{ name: 'SQL', value: 'sql' },
					{ name: 'Polling (Get Status)', value: 'polling' },
				],
				default: 'sql',
				description: 'Export output format',
			},
			{
				displayName: 'No Data',
				name: 'noData',
				type: 'boolean',
				default: false,
				description: 'Whether to export schema only without data',
			},
			{
				displayName: 'No Schema',
				name: 'noSchema',
				type: 'boolean',
				default: false,
				description: 'Whether to export data only without schema',
			},
			{
				displayName: 'Tables',
				name: 'tables',
				type: 'string',
				default: '',
				placeholder: 'users,orders,products',
				description: 'Comma-separated list of tables to export (leave empty for all)',
			},
		],
	},

	// ===========================================
	//         Import fields
	// ===========================================
	{
		displayName: 'SQL Content',
		name: 'sqlContent',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		required: true,
		default: '',
		placeholder: 'CREATE TABLE users (ID INTEGER PRIMARY KEY, name TEXT);\nINSERT INTO users VALUES (1, "John");',
		description: 'SQL statements to import into the database',
		displayOptions: {
			show: {
				resource: ['database'],
				operation: ['import'],
			},
		},
	},
];
