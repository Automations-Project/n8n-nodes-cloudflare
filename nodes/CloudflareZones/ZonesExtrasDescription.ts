import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

// ============= Activation Check =============
export const activationCheckOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['activationCheck'],
			},
		},
		options: [
			{
				name: 'Trigger',
				value: 'trigger',
				description: 'Trigger a new activation check for a zone',
				action: 'Trigger activation check',
			},
		],
		default: 'trigger',
	},
];

export const activationCheckFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['activationCheck'],
			},
		},
	},
];

// ============= Zone Holds =============
export const zoneHoldOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['zoneHold'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a zone hold',
				action: 'Create a zone hold',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a zone hold',
				action: 'Delete a zone hold',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get zone hold status',
				action: 'Get zone hold status',
			},
		],
		default: 'get',
	},
];

export const zoneHoldFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['zoneHold'],
			},
		},
	},
	{
		displayName: 'Include Subdomains',
		name: 'includeSubdomains',
		type: 'boolean',
		default: false,
		description: 'Whether to include subdomains in the hold',
		displayOptions: {
			show: {
				resource: ['zoneHold'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Hold After',
		name: 'holdAfter',
		type: 'dateTime',
		default: '',
		description: 'When to start the hold (leave empty for immediate)',
		displayOptions: {
			show: {
				resource: ['zoneHold'],
				operation: ['delete'],
			},
		},
	},
];

// ============= Zone Plans =============
export const zonePlanOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['zonePlan'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get details of a plan',
				action: 'Get a plan',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List available plans',
				action: 'Get many plans',
			},
		],
		default: 'getMany',
	},
];

export const zonePlanFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['zonePlan'],
			},
		},
	},
	{
		displayName: 'Plan ID',
		name: 'planId',
		type: 'string',
		required: true,
		default: '',
		description: 'The plan identifier',
		displayOptions: {
			show: {
				resource: ['zonePlan'],
				operation: ['get'],
			},
		},
	},
];
