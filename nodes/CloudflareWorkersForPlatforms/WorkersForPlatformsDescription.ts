import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const workersForPlatformsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['namespace'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a dispatch namespace', action: 'Create namespace' },
			{ name: 'Delete', value: 'delete', description: 'Delete a dispatch namespace', action: 'Delete namespace' },
			{ name: 'Get', value: 'get', description: 'Get a dispatch namespace', action: 'Get namespace' },
			{ name: 'Get Many', value: 'getMany', description: 'List dispatch namespaces', action: 'List namespaces' },
		],
		default: 'getMany',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['script', 'dispatchScript'] } },
		options: [
			{ name: 'Delete', value: 'delete', description: 'Delete a script', action: 'Delete script' },
			{ name: 'Get', value: 'get', description: 'Get a script', action: 'Get script' },
			{ name: 'Get Many', value: 'getMany', description: 'List scripts in namespace', action: 'List scripts' },
			{ name: 'Upload', value: 'upload', description: 'Upload a script', action: 'Upload script' },
		],
		default: 'getMany',
	},
];

export const workersForPlatformsFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['namespace', 'script', 'dispatchScript'] } } },
	{
		displayName: 'Namespace Name',
		name: 'namespaceName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['namespace'], operation: ['create', 'get', 'delete'] } },
	},
	{
		displayName: 'Namespace',
		name: 'dispatchNamespace',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['script', 'dispatchScript'] } },
	},
	{
		displayName: 'Script Name',
		name: 'scriptName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['script', 'dispatchScript'], operation: ['get', 'delete', 'upload'] } },
	},
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
		description: 'JavaScript/TypeScript code for the dispatch Worker script',
		displayOptions: {
			show: {
				resource: ['script', 'dispatchScript'],
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
				resource: ['script', 'dispatchScript'],
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
];
