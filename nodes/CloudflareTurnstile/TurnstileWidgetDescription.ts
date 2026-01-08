import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const turnstileWidgetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['widget'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a Turnstile widget',
				action: 'Create a turnstile widget',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a Turnstile widget',
				action: 'Delete a turnstile widget',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a Turnstile widget',
				action: 'Get a turnstile widget',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List Turnstile widgets',
				action: 'List turnstile widgets',
			},
			{
				name: 'Rotate Secret',
				value: 'rotateSecret',
				description: 'Rotate the secret for a Turnstile widget',
				action: 'Rotate secret for a turnstile widget',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a Turnstile widget',
				action: 'Update a turnstile widget',
			},
		],
		default: 'getMany',
	},
];

export const turnstileWidgetFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['widget'],
			},
		},
	},

	// ===========================================
	//         Sitekey (ID)
	// ===========================================
	{
		displayName: 'Widget Name or ID',
		name: 'sitekey',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTurnstileWidgets',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'The sitekey of the widget. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['widget'],
				operation: ['delete', 'get', 'rotateSecret', 'update'],
			},
		},
	},

	// ===========================================
	//         Create/Update Fields
	// ===========================================
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Widget name',
		displayOptions: {
			show: {
				resource: ['widget'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		options: [
			{
				name: 'Managed',
				value: 'managed',
			},
			{
				name: 'Non-Interactive',
				value: 'non-interactive',
			},
			{
				name: 'Invisible',
				value: 'invisible',
			},
		],
		default: 'managed',
		description: 'Widget mode',
		displayOptions: {
			show: {
				resource: ['widget'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Domains',
		name: 'domains',
		type: 'string', // Could be array/collection but simple string comma-separated might be easier or string array. API expects array of strings.
		default: '',
		description: 'Comma-separated list of domains',
		displayOptions: {
			show: {
				resource: ['widget'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Bot Fight Mode',
		name: 'bot_fight_mode',
		type: 'boolean',
		default: false,
		description: 'Whether this widget will check for bots',
		displayOptions: {
			show: {
				resource: ['widget'],
				operation: ['create', 'update'],
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
				resource: ['widget'],
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
				resource: ['widget'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
