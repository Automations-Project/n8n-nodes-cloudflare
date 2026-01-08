import { INodeProperties } from 'n8n-workflow';
import { accountIdField, zoneIdField } from '../shared/SharedFields';

// Route Operations (Zone-based)
export const workersRouteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['route'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a route', action: 'Create route' },
			{ name: 'Delete', value: 'delete', description: 'Delete a route', action: 'Delete route' },
			{ name: 'Get', value: 'get', description: 'Get a route', action: 'Get route' },
			{ name: 'Get Many', value: 'getMany', description: 'List routes', action: 'List routes' },
			{ name: 'Update', value: 'update', description: 'Update a route', action: 'Update route' },
		],
		default: 'getMany',
	},
];

export const workersRouteFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['route'] } } },
	{
		displayName: 'Route ID',
		name: 'routeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['route'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Pattern',
		name: 'routePattern',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com/*',
		displayOptions: { show: { resource: ['route'], operation: ['create', 'update'] } },
	},
	{
		displayName: 'Script Name or ID',
		name: 'routeScript',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: { loadOptionsMethod: 'getWorkerScripts' },
		default: '',
		displayOptions: { show: { resource: ['route'], operation: ['create', 'update'] } },
	},
];

// Secret Operations (Account-based)
export const workersSecretOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['secret'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a secret', action: 'Create secret' },
			{ name: 'Delete', value: 'delete', description: 'Delete a secret', action: 'Delete secret' },
			{ name: 'Get Many', value: 'getMany', description: 'List secrets', action: 'List secrets' },
		],
		default: 'getMany',
	},
];

export const workersSecretFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['secret'] } } },
	{
		displayName: 'Script Name or ID',
		name: 'secretScriptName',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: { loadOptionsMethod: 'getWorkerScripts' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['secret'] } },
	},
	{
		displayName: 'Secret Name',
		name: 'secretName',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['secret'], operation: ['create', 'delete'] } },
	},
	{
		displayName: 'Secret Value',
		name: 'secretValue',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['secret'], operation: ['create'] } },
	},
];

// Version Operations
export const workersVersionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['version'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get a version', action: 'Get version' },
			{ name: 'Get Many', value: 'getMany', description: 'List versions', action: 'List versions' },
		],
		default: 'getMany',
	},
];

export const workersVersionFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['version'] } } },
	{
		displayName: 'Script Name or ID',
		name: 'versionScriptName',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: { loadOptionsMethod: 'getWorkerScripts' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['version'] } },
	},
	{
		displayName: 'Version ID',
		name: 'versionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['version'], operation: ['get'] } },
	},
];

// Deployment Operations
export const workersDeploymentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['deployment'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get current deployment', action: 'Get deployment' },
			{ name: 'Get Many', value: 'getMany', description: 'List deployments', action: 'List deployments' },
		],
		default: 'getMany',
	},
];

export const workersDeploymentFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['deployment'] } } },
	{
		displayName: 'Script Name or ID',
		name: 'deploymentScriptName',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: { loadOptionsMethod: 'getWorkerScripts' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['deployment'] } },
	},
];
