import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const workersCronOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cronTrigger'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List cron triggers for a script',
				action: 'List cron triggers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update cron triggers for a script',
				action: 'Update cron triggers',
			},
		],
		default: 'getMany',
	},
];

export const workersCronFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['cronTrigger'],
			},
		},
	},

	// ===========================================
	//         Script Name
	// ===========================================
	{
		displayName: 'Script Name or ID',
		name: 'scriptName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWorkerScripts',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'Name of the Worker script. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['cronTrigger'],
			},
		},
	},

	// ===========================================
	//         Update cron expressions
	// ===========================================
	{
		displayName: 'Cron Expressions',
		name: 'cronExpressions',
		type: 'string',
		required: true,
		default: '',
		placeholder: '*/5 * * * *, 0 0 * * *',
		description: 'Comma-separated cron expressions (e.g., "*/5 * * * *" for every 5 minutes)',
		displayOptions: {
			show: {
				resource: ['cronTrigger'],
				operation: ['update'],
			},
		},
	},
];
