import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const magicNetworkMonitoringOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['mnm'] } },
		options: [
			{ name: 'Get Config', value: 'getConfig', description: 'Get MNM configuration', action: 'Get configuration' },
			{ name: 'Update Config', value: 'updateConfig', description: 'Update MNM configuration', action: 'Update configuration' },
			{ name: 'Get Many Rules', value: 'listRules', description: 'List MNM rules', action: 'List rules' },
			{ name: 'Create Rule', value: 'createRule', description: 'Create an MNM rule', action: 'Create a rule' },
			{ name: 'Delete Rule', value: 'deleteRule', description: 'Delete an MNM rule', action: 'Delete a rule' },
		],
		default: 'getConfig',
	},
];

export const magicNetworkMonitoringFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['mnm'] } } },
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['mnm'], operation: ['deleteRule'] } },
	},
	{
		displayName: 'Rule Name',
		name: 'ruleName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['mnm'], operation: ['createRule'] } },
	},
	{
		displayName: 'Volume Threshold',
		name: 'volumeThreshold',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['mnm'], operation: ['createRule'] } },
	},
];
