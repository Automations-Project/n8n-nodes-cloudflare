import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

// Sinkholes Operations
export const intelSinkholesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['sinkhole'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', description: 'List sinkholes', action: 'List sinkholes' },
		],
		default: 'getMany',
	},
];

export const intelSinkholesFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['sinkhole'] } } },
];

// Indicator Feed Operations
export const intelIndicatorFeedOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['indicatorFeed'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create indicator feed', action: 'Create indicator feed' },
			{ name: 'Delete', value: 'delete', description: 'Delete indicator feed', action: 'Delete indicator feed' },
			{ name: 'Get', value: 'get', description: 'Get indicator feed', action: 'Get indicator feed' },
			{ name: 'Get Many', value: 'getMany', description: 'List indicator feeds', action: 'List indicator feeds' },
			{ name: 'Update', value: 'update', description: 'Update indicator feed', action: 'Update indicator feed' },
		],
		default: 'getMany',
	},
];

export const intelIndicatorFeedFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['indicatorFeed'] } } },
	{
		displayName: 'Feed ID',
		name: 'feedId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['indicatorFeed'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Feed Name',
		name: 'feedName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['indicatorFeed'], operation: ['create'] } },
	},
];

// Miscategorization Operations
export const intelMiscategorizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['miscategorization'] } },
		options: [
			{ name: 'Submit', value: 'submit', description: 'Submit miscategorization', action: 'Submit miscategorization' },
		],
		default: 'submit',
	},
];

export const intelMiscategorizationFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['miscategorization'] } } },
	{
		displayName: 'URL',
		name: 'miscatUrl',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['miscategorization'], operation: ['submit'] } },
	},
	{
		displayName: 'Suggested Category',
		name: 'miscatCategory',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['miscategorization'], operation: ['submit'] } },
	},
];
