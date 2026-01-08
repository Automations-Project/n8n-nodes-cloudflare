import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const uaRuleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['uaRule'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a user agent blocking rule',
				action: 'Create a user agent rule',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a user agent blocking rule',
				action: 'Delete a user agent rule',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user agent blocking rule',
				action: 'Get a user agent rule',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List user agent blocking rules',
				action: 'Get many user agent rules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a user agent blocking rule',
				action: 'Update a user agent rule',
			},
		],
		default: 'getMany',
	},
];

export const uaRuleFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['uaRule'],
			},
		},
	},
	{
		displayName: 'UA Rule ID',
		name: 'uaRuleId',
		type: 'string',
		required: true,
		default: '',
		description: 'The user agent rule identifier',
		displayOptions: {
			show: {
				resource: ['uaRule'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		options: [
			{ name: 'Block', value: 'block' },
			{ name: 'Challenge', value: 'challenge' },
			{ name: 'JS Challenge', value: 'js_challenge' },
			{ name: 'Managed Challenge', value: 'managed_challenge' },
		],
		default: 'block',
		required: true,
		description: 'Action to take',
		displayOptions: {
			show: {
				resource: ['uaRule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'User Agent',
		name: 'userAgent',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'BadBot/1.0',
		description: 'User agent string to match',
		displayOptions: {
			show: {
				resource: ['uaRule'],
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
				resource: ['uaRule'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the rule',
			},
			{
				displayName: 'Paused',
				name: 'paused',
				type: 'boolean',
				default: false,
				description: 'Whether the rule is paused',
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
				resource: ['uaRule'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the rule',
			},
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{ name: 'Block', value: 'block' },
					{ name: 'Challenge', value: 'challenge' },
					{ name: 'JS Challenge', value: 'js_challenge' },
				],
				default: 'block',
				description: 'Action to take',
			},
			{
				displayName: 'Paused',
				name: 'paused',
				type: 'boolean',
				default: false,
				description: 'Whether the rule is paused',
			},
			{
				displayName: 'User Agent',
				name: 'ua',
				type: 'string',
				default: '',
				description: 'User agent string',
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
				resource: ['uaRule'],
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
				resource: ['uaRule'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
