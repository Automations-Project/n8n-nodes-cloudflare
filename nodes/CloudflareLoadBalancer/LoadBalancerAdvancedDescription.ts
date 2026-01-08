import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

// Preview Operations
export const lbPreviewOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['preview'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Preview a load balancer configuration', action: 'Preview load balancer' },
		],
		default: 'get',
	},
];

export const lbPreviewFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['preview'] } } },
	{
		displayName: 'Preview ID',
		name: 'previewId',
		type: 'string',
		required: true,
		default: '',
		description: 'The preview ID returned from a load balancer create/update',
		displayOptions: { show: { resource: ['preview'], operation: ['get'] } },
	},
];

// Search Operations
export const lbSearchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['search'] } },
		options: [
			{ name: 'Search', value: 'search', description: 'Search for load balancer resources', action: 'Search load balancers' },
		],
		default: 'search',
	},
];

export const lbSearchFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['search'] } } },
	{
		displayName: 'Query',
		name: 'searchQuery',
		type: 'string',
		default: '',
		description: 'Search query for load balancer resources',
		displayOptions: { show: { resource: ['search'], operation: ['search'] } },
	},
	{
		displayName: 'Search Type',
		name: 'searchType',
		type: 'options',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Load Balancers', value: 'load_balancers' },
			{ name: 'Monitors', value: 'monitors' },
			{ name: 'Pools', value: 'pools' },
		],
		default: 'all',
		displayOptions: { show: { resource: ['search'], operation: ['search'] } },
	},
];

// References Operations (show what uses a pool/monitor)
export const lbReferencesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['references'] } },
		options: [
			{ name: 'Get Pool References', value: 'getPoolReferences', description: 'Get load balancers using a pool', action: 'Get pool references' },
			{ name: 'Get Monitor References', value: 'getMonitorReferences', description: 'Get pools using a monitor', action: 'Get monitor references' },
		],
		default: 'getPoolReferences',
	},
];

export const lbReferencesFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['references'] } } },
	{
		displayName: 'Pool ID',
		name: 'refPoolId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['references'], operation: ['getPoolReferences'] } },
	},
	{
		displayName: 'Monitor ID',
		name: 'refMonitorId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['references'], operation: ['getMonitorReferences'] } },
	},
];
