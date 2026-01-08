import { INodeProperties } from 'n8n-workflow';

// AI Resource Operations
export const radarAiOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ai'] } },
		options: [
			{ name: 'Get Summary', value: 'getSummary', description: 'Get AI-generated summary of internet trends', action: 'Get AI summary' },
		],
		default: 'getSummary',
	},
];

export const radarAiFields: INodeProperties[] = [
	{
		displayName: 'Date Range',
		name: 'aiDateRange',
		type: 'options',
		options: [
			{ name: 'Last 24 Hours', value: '1d' },
			{ name: 'Last 7 Days', value: '7d' },
			{ name: 'Last 30 Days', value: '30d' },
		],
		default: '7d',
		displayOptions: { show: { resource: ['ai'], operation: ['getSummary'] } },
	},
];

// Bots Resource Operations
export const radarBotsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['bots'] } },
		options: [
			{ name: 'Get Summary', value: 'getSummary', description: 'Get bot traffic summary', action: 'Get bots summary' },
			{ name: 'Get Top', value: 'getTop', description: 'Get top bot classes', action: 'Get top bots' },
		],
		default: 'getSummary',
	},
];

export const radarBotsFields: INodeProperties[] = [
	{
		displayName: 'Limit',
		name: 'botsLimit',
		type: 'number',
		default: 10,
		displayOptions: { show: { resource: ['bots'], operation: ['getTop'] } },
	},
];

// Netflows Resource Operations
export const radarNetflowsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['netflows'] } },
		options: [
			{ name: 'Get Summary', value: 'getSummary', description: 'Get netflow traffic summary', action: 'Get netflows summary' },
			{ name: 'Get Top', value: 'getTop', description: 'Get top netflow sources', action: 'Get top netflows' },
		],
		default: 'getSummary',
	},
];

export const radarNetflowsFields: INodeProperties[] = [];

// Email Security Resource Operations
export const radarEmailOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['email'] } },
		options: [
			{ name: 'Get Summary', value: 'getSummary', description: 'Get email security summary', action: 'Get email summary' },
			{ name: 'Get Malicious', value: 'getMalicious', description: 'Get malicious email stats', action: 'Get malicious emails' },
			{ name: 'Get Spam', value: 'getSpam', description: 'Get spam email stats', action: 'Get spam emails' },
		],
		default: 'getSummary',
	},
];

export const radarEmailFields: INodeProperties[] = [];

// Datasets Resource Operations
export const radarDatasetsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['datasets'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', description: 'List available datasets', action: 'List datasets' },
			{ name: 'Download', value: 'download', description: 'Download a dataset', action: 'Download dataset' },
		],
		default: 'getMany',
	},
];

export const radarDatasetsFields: INodeProperties[] = [
	{
		displayName: 'Dataset Alias',
		name: 'datasetAlias',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['datasets'], operation: ['download'] } },
	},
];

// Search Resource Operations
export const radarSearchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['search'] } },
		options: [
			{ name: 'Search', value: 'search', description: 'Search Radar data', action: 'Search radar' },
		],
		default: 'search',
	},
];

export const radarSearchFields: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'searchQuery',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['search'], operation: ['search'] } },
	},
];
