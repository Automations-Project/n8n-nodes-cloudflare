import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const ratePlansOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ratePlan'] } },
		options: [
			{ name: 'Get Many', value: 'getMany', description: 'List available rate plans', action: 'List rate plans' },
		],
		default: 'getMany',
	},
];

export const ratePlansFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['ratePlan'] } } },
];
