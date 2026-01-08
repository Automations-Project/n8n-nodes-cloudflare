import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const poolOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pool'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a pool',
				action: 'Create a pool',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a pool',
				action: 'Delete a pool',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a pool',
				action: 'Get a pool',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List pools',
				action: 'List pools',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a pool',
				action: 'Update a pool',
			},
		],
		default: 'getMany',
	},
];

export const poolFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['pool'],
			},
		},
	},

	// ===========================================
	//         Pool ID
	// ===========================================
	{
		displayName: 'Pool ID',
		name: 'poolId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the pool',
		displayOptions: {
			show: {
				resource: ['pool'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},

	// ===========================================
	//         Get Many Options
	// ===========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['pool'],
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
				resource: ['pool'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},

	// ===========================================
	//         Create fields
	// ===========================================
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'my-pool',
		description: 'Name of the pool',
		displayOptions: {
			show: {
				resource: ['pool'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Origins (JSON)',
		name: 'origins',
		type: 'json',
		required: true,
		default: '[{"name": "origin-1", "address": "1.2.3.4"}]',
		description: 'JSON array of origin objects with name and address',
		displayOptions: {
			show: {
				resource: ['pool'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Create Options',
		name: 'createOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['pool'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Pool description',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the pool is enabled',
			},
			{
				displayName: 'Monitor ID',
				name: 'monitor',
				type: 'string',
				default: '',
				description: 'ID of the monitor to use for health checks',
			},
		],
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
				resource: ['pool'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Pool description',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the pool is enabled',
			},
			{
				displayName: 'Monitor ID',
				name: 'monitor',
				type: 'string',
				default: '',
				description: 'ID of the monitor to use for health checks',
			},
			{
				displayName: 'Origins (JSON)',
				name: 'origins',
				type: 'json',
				default: '',
				description: 'JSON array of origin objects',
			},
		],
	},
];
