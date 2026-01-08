import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const accessRuleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['accessRule'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an access rule',
				action: 'Create an access rule',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an access rule',
				action: 'Delete an access rule',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an access rule',
				action: 'Get an access rule',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List access rules',
				action: 'List access rules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an access rule',
				action: 'Update an access rule',
			},
		],
		default: 'getMany',
	},
];

export const accessRuleFields: INodeProperties[] = [
	// ===========================================
	//         Zone ID
	// ===========================================
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['accessRule'],
			},
		},
	},

	// ===========================================
	//         Create Options
	// ===========================================
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		required: true,
		default: 'block',
		description: 'The action to apply to a matched request',
		options: [
			{
				name: 'Block',
				value: 'block',
			},
			{
				name: 'Challenge',
				value: 'challenge',
			},
			{
				name: 'JS Challenge',
				value: 'js_challenge',
			},
			{
				name: 'Managed Challenge',
				value: 'managed_challenge',
			},
			{
				name: 'Whitelist',
				value: 'whitelist',
			},
		],
		displayOptions: {
			show: {
				resource: ['accessRule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Target',
		name: 'target',
		type: 'options',
		required: true,
		default: 'ip',
		description: 'The target of the rule',
		options: [
			{
				name: 'Country',
				value: 'country',
			},
			{
				name: 'IP',
				value: 'ip',
			},
			{
				name: 'IP Range',
				value: 'ip_range',
			},
			{
				name: 'ASN',
				value: 'asn',
			},
		],
		displayOptions: {
			show: {
				resource: ['accessRule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		required: true,
		default: '',
		description: 'The value to match (e.g. IP address, country code, ASN)',
		displayOptions: {
			show: {
				resource: ['accessRule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Notes',
		name: 'notes',
		type: 'string',
		default: '',
		description: 'A note about the rule',
		displayOptions: {
			show: {
				resource: ['accessRule'],
				operation: ['create'],
			},
		},
	},

	// ===========================================
	//         Delete Options
	// ===========================================
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the access rule',
		displayOptions: {
			show: {
				resource: ['accessRule'],
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
				resource: ['accessRule'],
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
				resource: ['accessRule'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
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
				resource: ['accessRule'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{ name: 'Block', value: 'block' },
					{ name: 'Challenge', value: 'challenge' },
					{ name: 'JS Challenge', value: 'js_challenge' },
					{ name: 'Managed Challenge', value: 'managed_challenge' },
					{ name: 'Whitelist', value: 'whitelist' },
				],
				default: 'block',
				description: 'The action to apply to a matched request',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				description: 'A note about the rule',
			},
		],
	},
];
