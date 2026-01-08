import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const registrarDomainOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['domain'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a registrar domain',
				action: 'Get a registrar domain',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List registrar domains',
				action: 'List registrar domains',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a registrar domain',
				action: 'Update a registrar domain',
			},
		],
		default: 'getMany',
	},
];

export const registrarDomainFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['domain'],
			},
		},
	},

	// ===========================================
	//         Domain Name
	// ===========================================
	{
		displayName: 'Domain Name or ID',
		name: 'domainName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getRegistrarDomains',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'Domain name. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['get', 'update'],
			},
		},
	},

	// ===========================================
	//         Update Fields
	// ===========================================
	{
		displayName: 'Auto Renew',
		name: 'autoRenew',
		type: 'boolean',
		default: false,
		description: 'Whether the domain should auto-renew',
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Locked',
		name: 'locked',
		type: 'boolean',
		default: false,
		description: 'Whether the domain is locked',
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Privacy',
		name: 'privacy',
		type: 'boolean',
		default: false,
		description: 'Whether privacy is enabled',
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['update'],
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
				resource: ['domain'],
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
				resource: ['domain'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
