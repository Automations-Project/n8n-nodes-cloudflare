import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const subscriptionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['subscription'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a subscription',
				action: 'Create a subscription',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a subscription',
				action: 'Delete a subscription',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List subscriptions',
				action: 'Get many subscriptions',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a subscription',
				action: 'Update a subscription',
			},
		],
		default: 'getMany',
	},
];

export const subscriptionFields: INodeProperties[] = [
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['subscription'],
			},
		},
	},
	{
		displayName: 'Subscription ID',
		name: 'subscriptionId',
		type: 'string',
		required: true,
		default: '',
		description: 'The subscription identifier',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['delete', 'update'],
			},
		},
	},
	{
		displayName: 'Rate Plan ID',
		name: 'ratePlanId',
		type: 'string',
		required: true,
		default: '',
		description: 'The rate plan ID for the subscription',
		displayOptions: {
			show: {
				resource: ['subscription'],
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
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Frequency',
				name: 'frequency',
				type: 'options',
				options: [
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'Quarterly', value: 'quarterly' },
					{ name: 'Yearly', value: 'yearly' },
				],
				default: 'monthly',
				description: 'Billing frequency',
			},
			{
				displayName: 'Zone ID',
				name: 'zone_id',
				type: 'string',
				default: '',
				description: 'Zone identifier for zone-specific subscriptions',
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
				resource: ['subscription'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Frequency',
				name: 'frequency',
				type: 'options',
				options: [
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'Quarterly', value: 'quarterly' },
					{ name: 'Yearly', value: 'yearly' },
				],
				default: 'monthly',
				description: 'Billing frequency',
			},
			{
				displayName: 'Rate Plan ID',
				name: 'rate_plan_id',
				type: 'string',
				default: '',
				description: 'New rate plan ID',
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
				resource: ['subscription'],
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
				resource: ['subscription'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
