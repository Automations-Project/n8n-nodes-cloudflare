import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

// Keys Operations
export const imagesKeysOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['key'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', description: 'List signing keys', action: 'List keys' },
		],
		default: 'getMany',
	},
];

export const imagesKeysFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['key'] } } },
];

// Variants Operations
export const imagesVariantsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['variant'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a variant', action: 'Create variant' },
			{ name: 'Delete', value: 'delete', description: 'Delete a variant', action: 'Delete variant' },
			{ name: 'Get', value: 'get', description: 'Get a variant', action: 'Get variant' },
			{ name: 'Get Many', value: 'getMany', description: 'List variants', action: 'List variants' },
			{ name: 'Update', value: 'update', description: 'Update a variant', action: 'Update variant' },
		],
		default: 'getMany',
	},
];

export const imagesVariantsFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['variant'] } } },
	{
		displayName: 'Variant ID',
		name: 'variantId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['variant'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Variant Name',
		name: 'variantName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['variant'], operation: ['create'] } },
	},
	{
		displayName: 'Fit',
		name: 'variantFit',
		type: 'options',
		options: [
			{ name: 'Scale Down', value: 'scale-down' },
			{ name: 'Contain', value: 'contain' },
			{ name: 'Cover', value: 'cover' },
			{ name: 'Crop', value: 'crop' },
			{ name: 'Pad', value: 'pad' },
		],
		default: 'scale-down',
		displayOptions: { show: { resource: ['variant'], operation: ['create', 'update'] } },
	},
	{
		displayName: 'Width',
		name: 'variantWidth',
		type: 'number',
		default: 100,
		displayOptions: { show: { resource: ['variant'], operation: ['create', 'update'] } },
	},
	{
		displayName: 'Height',
		name: 'variantHeight',
		type: 'number',
		default: 100,
		displayOptions: { show: { resource: ['variant'], operation: ['create', 'update'] } },
	},
];
