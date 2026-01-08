import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const workflowsInstanceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['instance'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new workflow instance',
				action: 'Create an instance',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get instance details',
				action: 'Get an instance',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List workflow instances',
				action: 'List instances',
			},
			{
				name: 'Terminate',
				value: 'terminate',
				description: 'Terminate a workflow instance',
				action: 'Terminate an instance',
			},
		],
		default: 'getMany',
	},
];

export const workflowsInstanceFields: INodeProperties[] = [
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
				resource: ['instance'],
			},
		},
	},

	// ===========================================
	//         Workflow Name
	// ===========================================
	{
		displayName: 'Workflow Name or ID',
		name: 'workflowName',
		type: 'options',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getWorkflows',
		loadOptionsDependsOn: ['accountId'],
		},
		description: 'Name of the workflow. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['instance'],
			},
		},
	},

	// ===========================================
	//         Instance ID (for get, terminate)
	// ===========================================
	{
		displayName: 'Instance ID',
		name: 'instanceId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the workflow instance',
		displayOptions: {
			show: {
				resource: ['instance'],
				operation: ['get', 'terminate'],
			},
		},
	},

	// ===========================================
	//         Create fields
	// ===========================================
	{
		displayName: 'Parameters',
		name: 'instanceParams',
		type: 'json',
		default: '{}',
		description: 'Parameters to pass to the workflow instance',
		displayOptions: {
			show: {
				resource: ['instance'],
				operation: ['create'],
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
				resource: ['instance'],
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
				resource: ['instance'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'instanceFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['instance'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Queued', value: 'queued' },
					{ name: 'Running', value: 'running' },
					{ name: 'Complete', value: 'complete' },
					{ name: 'Errored', value: 'errored' },
					{ name: 'Terminated', value: 'terminated' },
				],
				default: '',
				description: 'Filter by instance status',
			},
		],
	},
];
