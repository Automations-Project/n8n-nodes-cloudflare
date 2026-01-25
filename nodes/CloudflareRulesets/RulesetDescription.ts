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
		displayName: 'Ruleset Name or ID',
		name: 'rulesetId',
		type: 'options',
		required: true,
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getRulesets',
			loadOptionsDependsOn: ['scope', 'accountId', 'zoneId'],
		},
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
		displayName: 'Ruleset Name or ID',
		name: 'phaseRulesetId',
		type: 'options',
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getRulesets',
			loadOptionsDependsOn: ['scope', 'accountId', 'zoneId'],
		},
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
	{
		displayName: 'Ruleset Name or ID',
		name: 'ruleRulesetId',
		type: 'options',
		required: true,
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getRulesets',
			loadOptionsDependsOn: ['scope', 'accountId', 'zoneId'],
		},
		displayOptions: { show: { resource: ['rule'] } },
	},
	{
		displayName: 'Rule Name or ID',
		name: 'ruleId',
		type: 'options',
		required: true,
		default: '',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getRules',
			loadOptionsDependsOn: ['scope', 'accountId', 'zoneId', 'ruleRulesetId'],
		},
		displayOptions: { show: { resource: ['rule'], operation: ['delete', 'update'] } },
	},
	// ===========================================
	//         Rule Input Mode Selection
	// ===========================================
	{
		displayName: 'Input Mode',
		name: 'ruleInputMode',
		type: 'options',
		options: [
			{ name: 'GUI Builder', value: 'gui', description: 'Use the visual builder to create rules' },
			{ name: 'JSON', value: 'json', description: 'Provide rule definition as raw JSON' },
		],
		default: 'gui',
		description: 'Choose how to define the rule',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'] } },
	},
	// ===========================================
	//         JSON Mode - Rule Definition
	// ===========================================
	{
		displayName: 'Rule (JSON)',
		name: 'ruleDefinition',
		type: 'json',
		default: '{}',
		description: 'Rule definition as raw JSON. See <a href="https://developers.cloudflare.com/ruleset-engine/rulesets-api/">Cloudflare Rulesets API</a> for schema.',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['json'] } },
	},
	// ===========================================
	//         GUI Mode - Rule Builder
	// ===========================================
	{
		displayName: 'Rule Description',
		name: 'ruleDescription',
		type: 'string',
		default: '',
		description: 'A human-readable description for this rule',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'] } },
	},
	{
		displayName: 'Expression (Filter)',
		name: 'ruleExpression',
		type: 'string',
		default: 'true',
		required: true,
		description: 'The filter expression that determines when this rule triggers. Use "true" to match all requests. See <a href="https://developers.cloudflare.com/ruleset-engine/rules-language/expressions/">Cloudflare expressions</a>.',
		placeholder: '(http.host eq "example.com" and http.request.uri.path eq "/old-page")',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'] } },
	},
	{
		displayName: 'Action',
		name: 'ruleAction',
		type: 'options',
		options: [
			{ name: 'Redirect', value: 'redirect', description: 'Redirect the request to a different URL' },
			{ name: 'Block', value: 'block', description: 'Block the request' },
			{ name: 'JS Challenge', value: 'js_challenge', description: 'Present a JavaScript challenge' },
			{ name: 'Managed Challenge', value: 'managed_challenge', description: 'Present a managed challenge' },
			{ name: 'Log', value: 'log', description: 'Log the request without taking action' },
			{ name: 'Skip', value: 'skip', description: 'Skip other rules' },
			{ name: 'Rewrite', value: 'rewrite', description: 'Rewrite the request URI or query string' },
			{ name: 'Route', value: 'route', description: 'Route to a specific origin' },
			{ name: 'Set Config', value: 'set_config', description: 'Modify Cloudflare configuration settings' },
		],
		default: 'redirect',
		required: true,
		description: 'The action to take when the rule matches',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'] } },
	},
	// ===========================================
	//         Redirect Action Parameters
	// ===========================================
	{
		displayName: 'Redirect Type',
		name: 'redirectType',
		type: 'options',
		options: [
			{ name: 'Static URL', value: 'static', description: 'Redirect to a fixed URL' },
			{ name: 'Dynamic URL', value: 'dynamic', description: 'Redirect using an expression to build the target URL' },
		],
		default: 'static',
		description: 'Whether to use a static URL or a dynamic expression',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'], ruleAction: ['redirect'] } },
	},
	{
		displayName: 'Target URL',
		name: 'redirectTargetUrl',
		type: 'string',
		default: '',
		required: true,
		description: 'The URL to redirect to',
		placeholder: 'https://example.com/new-page',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'], ruleAction: ['redirect'], redirectType: ['static'] } },
	},
	{
		displayName: 'Target URL Expression',
		name: 'redirectTargetExpression',
		type: 'string',
		default: '',
		required: true,
		description: 'An expression that evaluates to the target URL. See <a href="https://developers.cloudflare.com/ruleset-engine/rules-language/expressions/">Cloudflare expressions</a>.',
		placeholder: 'concat("https://example.com", http.request.uri.path)',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'], ruleAction: ['redirect'], redirectType: ['dynamic'] } },
	},
	{
		displayName: 'Status Code',
		name: 'redirectStatusCode',
		type: 'options',
		options: [
			{ name: '301 - Moved Permanently', value: 301 },
			{ name: '302 - Found (Moved Temporarily)', value: 302 },
			{ name: '307 - Temporary Redirect', value: 307 },
			{ name: '308 - Permanent Redirect', value: 308 },
		],
		default: 301,
		description: 'The HTTP status code to use for the redirect',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'], ruleAction: ['redirect'] } },
	},
	{
		displayName: 'Preserve Query String',
		name: 'redirectPreserveQuery',
		type: 'boolean',
		default: false,
		description: 'Whether to keep the original query string in the redirected URL',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'], ruleAction: ['redirect'] } },
	},
	// ===========================================
	//         Rewrite Action Parameters
	// ===========================================
	{
		displayName: 'Rewrite Type',
		name: 'rewriteType',
		type: 'options',
		options: [
			{ name: 'URI Path', value: 'uri_path', description: 'Rewrite the request URI path' },
			{ name: 'Query String', value: 'query', description: 'Rewrite the query string' },
		],
		default: 'uri_path',
		description: 'What part of the request to rewrite',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'], ruleAction: ['rewrite'] } },
	},
	{
		displayName: 'Is Dynamic',
		name: 'rewriteIsDynamic',
		type: 'boolean',
		default: false,
		description: 'Whether to use a dynamic expression instead of a static value',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'], ruleAction: ['rewrite'] } },
	},
	{
		displayName: 'New Path/Query Value',
		name: 'rewriteValue',
		type: 'string',
		default: '',
		description: 'The new static value for the path or query string',
		placeholder: '/new-path',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'], ruleAction: ['rewrite'], rewriteIsDynamic: [false] } },
	},
	{
		displayName: 'Dynamic Expression',
		name: 'rewriteExpression',
		type: 'string',
		default: '',
		description: 'An expression that evaluates to the new path or query value',
		placeholder: 'concat("/api/v2", http.request.uri.path)',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'], ruleAction: ['rewrite'], rewriteIsDynamic: [true] } },
	},
	// ===========================================
	//         Route Action Parameters
	// ===========================================
	{
		displayName: 'Origin Hostname',
		name: 'routeHostname',
		type: 'string',
		default: '',
		description: 'The hostname of the origin server to route to',
		placeholder: 'origin.example.com',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'], ruleAction: ['route'] } },
	},
	// ===========================================
	//         Common Rule Options
	// ===========================================
	{
		displayName: 'Rule Enabled',
		name: 'ruleEnabled',
		type: 'boolean',
		default: true,
		description: 'Whether the rule is enabled',
		displayOptions: { show: { resource: ['rule'], operation: ['create', 'update'], ruleInputMode: ['gui'] } },
	},
];
