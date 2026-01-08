import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const pageShieldOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['pageShield'] } },
		options: [
			{ name: 'Get Settings', value: 'getSettings', description: 'Get Page Shield settings', action: 'Get settings' },
			{ name: 'Update Settings', value: 'updateSettings', description: 'Update Page Shield settings', action: 'Update settings' },
			{ name: 'Get Many Scripts', value: 'listScripts', description: 'List detected scripts', action: 'List scripts' },
			{ name: 'Get Script', value: 'getScript', description: 'Get a script', action: 'Get a script' },
			{ name: 'Get Many Connections', value: 'listConnections', description: 'List detected connections', action: 'List connections' },
			{ name: 'Get Connection', value: 'getConnection', description: 'Get a connection', action: 'Get a connection' },
			{ name: 'Create Policy', value: 'createPolicy', description: 'Create a policy', action: 'Create a policy' },
			{ name: 'Delete Policy', value: 'deletePolicy', description: 'Delete a policy', action: 'Delete a policy' },
			{ name: 'Get Many Policies', value: 'listPolicies', description: 'List policies', action: 'List policies' },
		],
		default: 'getSettings',
	},
];

export const pageShieldFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['pageShield'] } } },
	{
		displayName: 'Script ID',
		name: 'scriptId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['pageShield'], operation: ['getScript'] } },
	},
	{
		displayName: 'Connection ID',
		name: 'connectionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['pageShield'], operation: ['getConnection'] } },
	},
	{
		displayName: 'Policy ID',
		name: 'policyId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['pageShield'], operation: ['deletePolicy'] } },
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['pageShield'], operation: ['updateSettings'] } },
	},
	{
		displayName: 'Policy Action',
		name: 'action',
		type: 'options',
		options: [
			{ name: 'Allow', value: 'allow' },
			{ name: 'Log', value: 'log' },
		],
		default: 'log',
		displayOptions: { show: { resource: ['pageShield'], operation: ['createPolicy'] } },
	},
	{
		displayName: 'Expression',
		name: 'expression',
		type: 'string',
		default: '',
		description: 'Policy expression',
		displayOptions: { show: { resource: ['pageShield'], operation: ['createPolicy'] } },
	},
];
