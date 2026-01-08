import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const tunnelsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['tunnel'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a Cloudflare Tunnel', action: 'Create a tunnel' },
			{ name: 'Delete', value: 'delete', description: 'Delete a tunnel', action: 'Delete a tunnel' },
			{ name: 'Get', value: 'get', description: 'Get a tunnel', action: 'Get a tunnel' },
			{ name: 'Get Many', value: 'getMany', description: 'List tunnels', action: 'List tunnels' },
			{ name: 'Get Configurations', value: 'getConfig', description: 'Get tunnel configurations', action: 'Get tunnel configurations' },
			{ name: 'Update Configurations', value: 'updateConfig', description: 'Update tunnel configurations', action: 'Update tunnel configurations' },
			{ name: 'Get Token', value: 'getToken', description: 'Get tunnel token', action: 'Get tunnel token' },
		],
		default: 'getMany',
	},
];

export const tunnelsFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['tunnel'] } } },
	{
		displayName: 'Tunnel ID',
		name: 'tunnelId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['tunnel'], operation: ['get', 'delete', 'getConfig', 'updateConfig', 'getToken'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['tunnel'], operation: ['create'] } },
	},
	{
		displayName: 'Tunnel Secret',
		name: 'tunnelSecret',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		description: 'A 32+ character secret for the tunnel',
		displayOptions: { show: { resource: ['tunnel'], operation: ['create'] } },
	},
	{
		displayName: 'Config JSON',
		name: 'configJson',
		type: 'json',
		default: '{}',
		displayOptions: { show: { resource: ['tunnel'], operation: ['updateConfig'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		description: 'Whether to return all results or only up to a given limit',
		default: false,
		displayOptions: { show: { resource: ['tunnel'], operation: ['getMany'] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		description: 'Max number of results to return',
		default: 50,
		displayOptions: { show: { resource: ['tunnel'], operation: ['getMany'], returnAll: [false] } },
	},
];
