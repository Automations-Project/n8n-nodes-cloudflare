import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const pagesDeploymentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deployment'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a deployment',
				action: 'Delete a deployment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get deployment details',
				action: 'Get a deployment',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List deployments for a project',
				action: 'List deployments',
			},
			{
				name: 'Retry',
				value: 'retry',
				description: 'Retry a failed deployment',
				action: 'Retry a deployment',
			},
			{
				name: 'Rollback',
				value: 'rollback',
				description: 'Rollback to a previous deployment',
				action: 'Rollback a deployment',
			},
		],
		default: 'getMany',
	},
];

export const pagesDeploymentFields: INodeProperties[] = [
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
				resource: ['deployment'],
			},
		},
	},

	// ===========================================
	//         Project Name
	// ===========================================
	{
		displayName: 'Project Name or ID',
		name: 'projectName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getPagesProjects',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'Name of the Pages project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['deployment'],
			},
		},
	},

	// ===========================================
	//         Deployment ID (for get, delete, retry, rollback)
	// ===========================================
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the deployment',
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['get', 'delete', 'retry', 'rollback'],
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
				resource: ['deployment'],
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
				resource: ['deployment'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'deploymentFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['deployment'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Environment',
				name: 'env',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Production', value: 'production' },
					{ name: 'Preview', value: 'preview' },
				],
				default: '',
				description: 'Filter by deployment environment',
			},
		],
	},
];
