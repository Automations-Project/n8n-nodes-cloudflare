import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const workflowsWorkflowOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workflow'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get workflow details',
				action: 'Get a workflow',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all workflows',
				action: 'List workflows',
			},
		],
		default: 'getMany',
	},
];

export const workflowsWorkflowFields: INodeProperties[] = [
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
				resource: ['workflow'],
			},
		},
	},

	// ===========================================
	//         Workflow Name (for get)
	// ===========================================
	{
		displayName: 'Workflow Name or ID',
		name: 'workflowName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWorkflows',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'Name of the workflow. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['get'],
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
				resource: ['workflow'],
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
				resource: ['workflow'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
