import { INodeProperties } from 'n8n-workflow';
import { accountIdField, zoneIdField } from '../shared/SharedFields';

// ===========================================
//         Ruleset Operations
// ===========================================
export const rulesetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ruleset'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a ruleset', action: 'Create a ruleset' },
			{ name: 'Delete', value: 'delete', description: 'Delete a ruleset', action: 'Delete a ruleset' },
			{ name: 'Get', value: 'get', description: 'Get ruleset details', action: 'Get a ruleset' },
			{ name: 'Get Many', value: 'getMany', description: 'List rulesets', action: 'List rulesets' },
			{ name: 'Update', value: 'update', description: 'Update a ruleset', action: 'Update a ruleset' },
		],
		default: 'getMany',
	},
	// Phase Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['phase'] } },
		options: [
			{ name: 'Get Entrypoint', value: 'getEntrypoint', description: 'Get phase entrypoint ruleset', action: 'Get phase entrypoint' },
			{ name: 'Update Entrypoint', value: 'updateEntrypoint', description: 'Update phase entrypoint', action: 'Update phase entrypoint' },
			{ name: 'List Versions', value: 'listVersions', description: 'List ruleset versions', action: 'List versions' },
			{ name: 'Get Version', value: 'getVersion', description: 'Get specific version', action: 'Get version' },
		],
		default: 'getEntrypoint',
	},
	// Rule Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['rule'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Add a rule to a ruleset', action: 'Create a rule' },
			{ name: 'Delete', value: 'delete', description: 'Delete a rule from a ruleset', action: 'Delete a rule' },
			{ name: 'Update', value: 'update', description: 'Update a rule in a ruleset', action: 'Update a rule' },
		],
		default: 'create',
	},
];

export const rulesetFields: INodeProperties[] = [
	// Scope selection
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		options: [
			{ name: 'Account', value: 'account' },
			{ name: 'Zone', value: 'zone' },
		],
		default: 'zone',
		description: 'Whether to apply to account or zone level',
		displayOptions: {
			show: {
				resource: ['ruleset'],
			},
		},
	},

	// Account ID (for account scope)
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['ruleset'],
				scope: ['account'],
			},
		},
	},

	// Zone ID (for zone scope)
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['ruleset'],
				scope: ['zone'],
			},
		},
	},

	// Ruleset ID for get/update/delete
	{
		displayName: 'Ruleset ID',
		name: 'rulesetId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the ruleset',
		displayOptions: {
			show: {
				resource: ['ruleset'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},

	// Create fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Human-readable name for the ruleset',
		displayOptions: {
			show: {
				resource: ['ruleset'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Kind',
		name: 'kind',
		type: 'options',
		options: [
			{ name: 'Custom', value: 'custom' },
			{ name: 'Managed', value: 'managed' },
			{ name: 'Root', value: 'root' },
			{ name: 'Zone', value: 'zone' },
		],
		default: 'zone',
		required: true,
		description: 'The kind of ruleset',
		displayOptions: {
			show: {
				resource: ['ruleset'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Phase',
		name: 'phase',
		type: 'options',
		options: [
			{ name: 'HTTP Request Firewall Custom', value: 'http_request_firewall_custom' },
			{ name: 'HTTP Request Firewall Managed', value: 'http_request_firewall_managed' },
			{ name: 'HTTP Request Late Transform', value: 'http_request_late_transform' },
			{ name: 'HTTP Request Origin', value: 'http_request_origin' },
			{ name: 'HTTP Request Redirect', value: 'http_request_redirect' },
			{ name: 'HTTP Request Sanitize', value: 'http_request_sanitize' },
			{ name: 'HTTP Request Transform', value: 'http_request_transform' },
			{ name: 'HTTP Response Firewall Managed', value: 'http_response_firewall_managed' },
			{ name: 'HTTP Response Headers Transform', value: 'http_response_headers_transform' },
		],
		default: 'http_request_firewall_custom',
		required: true,
		description: 'The phase where the ruleset executes',
		displayOptions: {
			show: {
				resource: ['ruleset'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Rules (JSON)',
		name: 'rules',
		type: 'json',
		default: '[]',
		description: 'Rules to include in the ruleset as JSON array',
		displayOptions: {
			show: {
				resource: ['ruleset'],
				operation: ['create', 'update'],
			},
		},
	},

	// Update fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['ruleset'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Ruleset description',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Human-readable name',
			},
		],
	},

	// Get Many pagination
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['ruleset'],
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
				resource: ['ruleset'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	// Phase Fields
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		options: [{ name: 'Account', value: 'account' }, { name: 'Zone', value: 'zone' }],
		default: 'zone',
		displayOptions: { show: { resource: ['phase', 'rule'] } },
	},
	{ ...accountIdField, displayOptions: { show: { resource: ['phase', 'rule'], scope: ['account'] } } },
	{ ...zoneIdField, displayOptions: { show: { resource: ['phase', 'rule'], scope: ['zone'] } } },
	{
		displayName: 'Phase',
		name: 'phaseName',
		type: 'options',
		options: [
			{ name: 'HTTP Request Firewall Custom', value: 'http_request_firewall_custom' },
			{ name: 'HTTP Request Firewall Managed', value: 'http_request_firewall_managed' },
			{ name: 'HTTP Request Transform', value: 'http_request_transform' },
			{ name: 'HTTP Response Headers Transform', value: 'http_response_headers_transform' },
		],
		default: 'http_request_firewall_custom',
		displayOptions: { show: { resource: ['phase'] } },
	},
	{
		displayName: 'Ruleset ID',
		name: 'phaseRulesetId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['phase'], operation: ['listVersions', 'getVersion'] } },
	},
	{
		displayName: 'Version',
		name: 'version',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['phase'], operation: ['getVersion'] } },
	},
	{
		displayName: 'Rules (JSON)',
		name: 'phaseRules',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['phase'], operation: ['updateEntrypoint'] } },
	},
	// Rule Fields
	{
		displayName: 'Ruleset ID',
		name: 'ruleRulesetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['rule'] } },
	},
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['rule'], operation: ['delete', 'update'] } },
	},
	{
		displayName: 'Rule (JSON)',
		name: 'ruleDefinition',
		type: 'json',
		default: '{}',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'] } },
	},
];
