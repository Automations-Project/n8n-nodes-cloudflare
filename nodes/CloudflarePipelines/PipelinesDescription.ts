import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const pipelinesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['pipeline'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a pipeline', action: 'Create a pipeline' },
			{ name: 'Delete', value: 'delete', description: 'Delete a pipeline', action: 'Delete a pipeline' },
			{ name: 'Get', value: 'get', description: 'Get a pipeline', action: 'Get a pipeline' },
			{ name: 'Get Many', value: 'getMany', description: 'List pipelines', action: 'List pipelines' },
			{ name: 'Update', value: 'update', description: 'Update a pipeline', action: 'Update a pipeline' },
		],
		default: 'getMany',
	},
];

export const pipelinesFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['pipeline'] } } },
	{
		displayName: 'Pipeline Name',
		name: 'pipelineName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['pipeline'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['pipeline'], operation: ['create'] } },
	},
	{
		displayName: 'Pipeline Config (JSON)',
		name: 'config',
		type: 'json',
		default: '{}',
		displayOptions: { show: { resource: ['pipeline'], operation: ['create', 'update'] } },
	},
];
