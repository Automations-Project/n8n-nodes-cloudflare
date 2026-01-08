import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const kvNamespaceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['namespace'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new KV namespace',
				action: 'Create a namespace',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a KV namespace',
				action: 'Delete a namespace',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all KV namespaces',
				action: 'List namespaces',
			},
			{
				name: 'Rename',
				value: 'rename',
				description: 'Rename a KV namespace',
				action: 'Rename a namespace',
			},
		],
		default: 'getMany',
	},
];

export const kvNamespaceFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['namespace'],
			},
		},
	},

	// ===========================================
	//         Namespace ID (for delete, rename)
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
				resource: ['namespace'],
				operation: ['delete', 'rename'],
			},
		},
	},

	// ===========================================
	//         Create fields
	// ===========================================
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'my-namespace',
		description: 'A human-readable title for the namespace',
		displayOptions: {
			show: {
				resource: ['namespace'],
				operation: ['create', 'rename'],
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
				resource: ['namespace'],
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
				resource: ['namespace'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
