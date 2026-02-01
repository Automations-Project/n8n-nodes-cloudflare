import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const workersScriptOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['script'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a Worker script',
				action: 'Delete a worker script',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get Worker script metadata',
				action: 'Get a worker script',
			},
			{
				name: 'Get Content',
				value: 'getContent',
				description: 'Get Worker script source code',
				action: 'Get worker script content',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all Worker scripts',
				action: 'List worker scripts',
			},
			{
				name: 'Get Settings',
				value: 'getSettings',
				description: 'Get Worker script settings',
				action: 'Get worker settings',
			},
			{
				name: 'Update Settings',
				value: 'updateSettings',
				description: 'Update Worker script settings',
				action: 'Update worker settings',
			},
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload/deploy a Worker script',
				action: 'Upload a worker script',
			},
		],
		default: 'getMany',
	},
];

export const workersScriptFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['script'],
			},
		},
	},

	// ===========================================
	//         Script Name (for get, delete, upload)
	// ===========================================
	{
		displayName: 'Script Name or ID',
		name: 'scriptName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWorkerScripts',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'Name of the Worker script. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['script'],
				operation: ['get', 'delete', 'getContent', 'getSettings', 'updateSettings'],
			},
		},
	},
	{
		displayName: 'Script Name',
		name: 'scriptName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'my-worker-script',
		description: 'Name of the Worker script to upload/deploy. Use lowercase letters, numbers, and hyphens.',
		displayOptions: {
			show: {
				resource: ['script'],
				operation: ['upload'],
			},
		},
	},

	// ===========================================
	//         Upload fields
	// ===========================================
	{
		displayName: 'Script Content',
		name: 'scriptContent',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		required: true,
		default: '',
		placeholder: 'export default { async fetch(request) { return new Response("Hello!"); } }',
		description: 'JavaScript/TypeScript code for the Worker',
		displayOptions: {
			show: {
				resource: ['script'],
				operation: ['upload'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'uploadOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['script'],
				operation: ['upload'],
			},
		},
		options: [
			{
				displayName: 'Compatibility Date',
				name: 'compatibilityDate',
				type: 'string',
				default: '',
				placeholder: '2024-01-01',
				description: 'Compatibility date for the Worker runtime',
			},
			{
				displayName: 'Module Type',
				name: 'moduleType',
				type: 'options',
				options: [
					{ name: 'ES Module', value: 'esm' },
					{ name: 'Service Worker', value: 'sw' },
				],
				default: 'esm',
				description: 'Type of Worker module format',
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
				resource: ['script'],
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
				resource: ['script'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},

	// ===========================================
	//         Update Settings fields
	// ===========================================
	{
		displayName: 'Settings',
		name: 'settingsFields',
		type: 'collection',
		placeholder: 'Add Setting',
		default: {},
		displayOptions: {
			show: {
				resource: ['script'],
				operation: ['updateSettings'],
			},
		},
		options: [
			{
				displayName: 'Compatibility Date',
				name: 'compatibilityDate',
				type: 'string',
				default: '',
				placeholder: '2024-01-01',
				description: 'Compatibility date for the Worker runtime',
			},
			{
				displayName: 'Compatibility Flags',
				name: 'compatibilityFlags',
				type: 'string',
				default: '',
				placeholder: 'nodejs_compat,streams_enable_constructors',
				description: 'Comma-separated list of compatibility flags',
			},
			{
				displayName: 'Logpush',
				name: 'logpush',
				type: 'boolean',
				default: false,
				description: 'Whether to enable Logpush for this Worker',
			},
		],
	},
];
