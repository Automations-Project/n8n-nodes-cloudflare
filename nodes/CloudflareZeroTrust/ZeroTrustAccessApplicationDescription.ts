import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const accessApplicationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['accessApplication'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an Access application',
				action: 'Delete an access application',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an Access application',
				action: 'Get an access application',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List Access applications',
				action: 'List access applications',
			},
		],
		default: 'getMany',
	},
];

export const accessApplicationFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['accessApplication'],
			},
		},
	},

	// ===========================================
	//         Application ID (for delete, get)
	// ===========================================
	{
		displayName: 'Application Name or ID',
		name: 'applicationId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getAccessApplications',
		loadOptionsDependsOn: ['accountId'],
		},
		description: 'ID of the Access application. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['accessApplication'],
				operation: ['delete', 'get'],
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
				resource: ['accessApplication'],
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
				resource: ['accessApplication'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
