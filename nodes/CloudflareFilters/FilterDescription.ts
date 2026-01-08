import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const filterOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['filter'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new filter',
				action: 'Create a filter',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a filter',
				action: 'Delete a filter',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a filter by ID',
				action: 'Get a filter',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all filters',
				action: 'Get many filters',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a filter',
				action: 'Update a filter',
			},
		],
		default: 'getMany',
	},
];

export const filterFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['filter'],
			},
		},
	},
	{
		displayName: 'Filter ID',
		name: 'filterId',
		type: 'string',
		required: true,
		default: '',
		description: 'The filter identifier',
		displayOptions: {
			show: {
				resource: ['filter'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Expression',
		name: 'expression',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'ip.src eq 93.184.216.0',
		description: 'The filter expression using Cloudflare\'s filter syntax',
		displayOptions: {
			show: {
				resource: ['filter'],
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
				resource: ['filter'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A human-readable description of the filter',
			},
			{
				displayName: 'Paused',
				name: 'paused',
				type: 'boolean',
				default: false,
				description: 'Whether the filter is paused',
			},
			{
				displayName: 'Ref',
				name: 'ref',
				type: 'string',
				default: '',
				description: 'Short reference tag for the filter',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['filter'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A human-readable description of the filter',
			},
			{
				displayName: 'Expression',
				name: 'expression',
				type: 'string',
				default: '',
				description: 'The filter expression',
			},
			{
				displayName: 'Paused',
				name: 'paused',
				type: 'boolean',
				default: false,
				description: 'Whether the filter is paused',
			},
			{
				displayName: 'Ref',
				name: 'ref',
				type: 'string',
				default: '',
				description: 'Short reference tag for the filter',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['filter'],
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
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['filter'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
