import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const aiGatewayLogOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['log'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get log entry details',
				action: 'Get a log entry',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List gateway logs',
				action: 'List log entries',
			},
		],
		default: 'getMany',
	},
];

export const aiGatewayLogFields: INodeProperties[] = [
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
				resource: ['log'],
			},
		},
	},

	// ===========================================
	//         Gateway ID
	// ===========================================
	{
		displayName: 'Gateway Name or ID',
		name: 'gatewayId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getAiGateways',
		loadOptionsDependsOn: ['accountId'],
		},
		description: 'ID of the AI Gateway. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['log'],
			},
		},
	},

	// ===========================================
	//         Log ID (for get)
	// ===========================================
	{
		displayName: 'Log ID',
		name: 'logId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the log entry',
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['get'],
			},
		},
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
				resource: ['log'],
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
				resource: ['log'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'logFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Cached',
				name: 'cached',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by cached responses',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for log filter',
			},
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'options',
				options: [
					{ name: 'Created At (Ascending)', value: 'created_at' },
					{ name: 'Created At (Descending)', value: '-created_at' },
				],
				default: '-created_at',
				description: 'Order logs by field',
			},
			{
				displayName: 'Provider',
				name: 'provider',
				type: 'string',
				default: '',
				description: 'Filter by AI provider (e.g., openai, anthropic)',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for log filter',
			},
			{
				displayName: 'Success',
				name: 'success',
				type: 'boolean',
				default: true,
				description: 'Whether to filter by successful requests',
			},
		],
	},
];
