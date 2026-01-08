import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const cloudConnectorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['cloudConnector'] } },
		options: [
			{ name: 'Get Rules', value: 'getRules', description: 'Get cloud connector rules', action: 'Get rules' },
			{ name: 'Update Rules', value: 'updateRules', description: 'Update cloud connector rules', action: 'Update rules' },
		],
		default: 'getRules',
	},
];

export const cloudConnectorFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['cloudConnector'] } } },
	{
		displayName: 'Rules (JSON)',
		name: 'rules',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['cloudConnector'], operation: ['updateRules'] } },
	},
];
