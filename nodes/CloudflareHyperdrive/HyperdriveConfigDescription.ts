import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const hyperdriveConfigOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['config'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a Hyperdrive config',
				action: 'Create a config',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a Hyperdrive config',
				action: 'Delete a config',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get config details',
				action: 'Get a config',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all Hyperdrive configs',
				action: 'List configs',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a Hyperdrive config',
				action: 'Update a config',
			},
		],
		default: 'getMany',
	},
];

export const hyperdriveConfigFields: INodeProperties[] = [
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
				resource: ['config'],
			},
		},
	},

	// ===========================================
	//         Config ID (for get, delete, update)
	// ===========================================
	{
		displayName: 'Config Name or ID',
		name: 'configId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getHyperdriveConfigs',
		loadOptionsDependsOn: ['accountId'],
		},
		description: 'ID of the Hyperdrive config. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['get', 'delete', 'update'],
			},
		},
	},

	// ===========================================
	//         Create fields
	// ===========================================
	{
		displayName: 'Name',
		name: 'configName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the Hyperdrive config',
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Database Host',
		name: 'dbHost',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'db.example.com',
		description: 'Database server hostname',
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Database Port',
		name: 'dbPort',
		type: 'number',
		required: true,
		default: 5432,
		description: 'Database server port',
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Database Name',
		name: 'dbName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the database',
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Database User',
		name: 'dbUser',
		type: 'string',
		required: true,
		default: '',
		description: 'Database username',
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Database Password',
		name: 'dbPassword',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'configOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Scheme',
				name: 'scheme',
				type: 'options',
				options: [
					{ name: 'PostgreSQL', value: 'postgres' },
					{ name: 'PostgreSQL (SSL)', value: 'postgresql' },
				],
				default: 'postgres',
				description: 'Database connection scheme',
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
				resource: ['config'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Database Host',
				name: 'host',
				type: 'string',
				default: '',
				description: 'Database server hostname',
			},
			{
				displayName: 'Database Name',
				name: 'database',
				type: 'string',
				default: '',
				description: 'Name of the database',
			},
			{
				displayName: 'Database Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			},
			{
				displayName: 'Database Port',
				name: 'port',
				type: 'number',
				default: 5432,
				description: 'Database server port',
			},
			{
				displayName: 'Database User',
				name: 'user',
				type: 'string',
				default: '',
				description: 'Database username',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the Hyperdrive config',
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
				resource: ['config'],
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
				resource: ['config'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
