import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const pagesProjectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['project'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new Pages project',
				action: 'Create a project',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a Pages project',
				action: 'Delete a project',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get project details',
				action: 'Get a project',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all Pages projects',
				action: 'List projects',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a Pages project',
				action: 'Update a project',
			},
		],
		default: 'getMany',
	},
];

export const pagesProjectFields: INodeProperties[] = [
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
				resource: ['project'],
			},
		},
	},

	// ===========================================
	//         Project Name (for create, get, delete)
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
				resource: ['project'],
				operation: ['get', 'delete', 'update'],
			},
		},
	},
	{
		displayName: 'Project Name',
		name: 'projectName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the Pages project to create',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
	},

	// ===========================================
	//         Create fields
	// ===========================================
	{
		displayName: 'Production Branch',
		name: 'productionBranch',
		type: 'string',
		required: true,
		default: 'main',
		description: 'The branch to serve production deployments from',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'projectOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Build Command',
				name: 'buildCommand',
				type: 'string',
				default: '',
				placeholder: 'npm run build',
				description: 'Command to build the project',
			},
			{
				displayName: 'Destination Directory',
				name: 'destinationDir',
				type: 'string',
				default: '',
				placeholder: 'dist',
				description: 'Directory to serve after build',
			},
			{
				displayName: 'Root Directory',
				name: 'rootDir',
				type: 'string',
				default: '',
				description: 'Root directory for the project',
			},
		],
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
				resource: ['project'],
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
				resource: ['project'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},

	// ===========================================
	//         Update fields
	// ===========================================
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Production Branch',
				name: 'productionBranch',
				type: 'string',
				default: '',
				description: 'The branch to serve production deployments from',
			},
			{
				displayName: 'Build Command',
				name: 'buildCommand',
				type: 'string',
				default: '',
				placeholder: 'npm run build',
				description: 'Command to build the project',
			},
			{
				displayName: 'Destination Directory',
				name: 'destinationDir',
				type: 'string',
				default: '',
				placeholder: 'dist',
				description: 'Directory to serve after build',
			},
			{
				displayName: 'Root Directory',
				name: 'rootDir',
				type: 'string',
				default: '',
				description: 'Root directory for the project',
			},
		],
	},
];
