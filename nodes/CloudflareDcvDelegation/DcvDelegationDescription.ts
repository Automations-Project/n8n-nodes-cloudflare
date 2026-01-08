import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const dcvDelegationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dcvDelegation'] } },
		options: [
			{ name: 'Get UUID', value: 'getUuid', description: 'Get DCV delegation UUID', action: 'Get UUID' },
		],
		default: 'getUuid',
	},
];

export const dcvDelegationFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['dcvDelegation'] } } },
];
