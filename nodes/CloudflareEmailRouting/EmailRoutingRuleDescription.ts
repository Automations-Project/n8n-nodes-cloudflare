import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const emailRoutingRuleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['rule'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an email routing rule',
				action: 'Create an email routing rule',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an email routing rule',
				action: 'Delete an email routing rule',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an email routing rule',
				action: 'Get an email routing rule',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List email routing rules',
				action: 'List email routing rules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an email routing rule',
				action: 'Update an email routing rule',
			},
		],
		default: 'getMany',
	},
];

export const emailRoutingRuleFields: INodeProperties[] = [
	// ===========================================
	//         Zone ID
	// ===========================================
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['rule'],
			},
		},
	},

	// ===========================================
	//         Rule ID
	// ===========================================
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		default: '',
		description: 'Rule identifier',
		displayOptions: {
			show: {
				resource: ['rule'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},

	// ===========================================
	//         Create/Update Fields
	// ===========================================
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Rule name',
		displayOptions: {
			show: {
				resource: ['rule'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		description: 'Whether the rule is enabled',
		displayOptions: {
			show: {
				resource: ['rule'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Matchers',
		name: 'matchers',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		description: 'Matching patterns for the rule',
		placeholder: 'Add Matcher',
		options: [
			{
				name: 'matcher',
				displayName: 'Matcher',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Literal',
								value: 'literal',
							},
						],
						default: 'literal',
					},
					{
						displayName: 'Field',
						name: 'field',
						type: 'options',
						options: [
							{
								name: 'To',
								value: 'to',
							},
						],
						default: 'to',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The email address to match (e.g. custom@yourdomain.com)',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['rule'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Actions',
		name: 'actions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		description: 'Actions to perform when the rule matches',
		placeholder: 'Add Action',
		options: [
			{
				name: 'action',
				displayName: 'Action',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Forward',
								value: 'forward',
							},
							{
								name: 'Worker',
								value: 'worker',
							},
						],
						default: 'forward',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'For forward: [destination_address]. For worker: [worker_name].',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['rule'],
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['rule'],
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
				resource: ['rule'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
