import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const sharesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['share'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a resource share', action: 'Create a share' },
			{ name: 'Delete', value: 'delete', description: 'Delete a resource share', action: 'Delete a share' },
			{ name: 'Get', value: 'get', description: 'Get a resource share', action: 'Get a share' },
			{ name: 'Get Many', value: 'getMany', description: 'List resource shares', action: 'List shares' },
			{ name: 'Update', value: 'update', description: 'Update a resource share', action: 'Update a share' },
		],
		default: 'getMany',
	},
];

export const sharesFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['share'] } } },
	{
		displayName: 'Share ID',
		name: 'shareId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['share'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['share'], operation: ['create'] } },
	},
	{
		displayName: 'Resources (JSON)',
		name: 'resources',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['share'], operation: ['create', 'update'] } },
	},
];
