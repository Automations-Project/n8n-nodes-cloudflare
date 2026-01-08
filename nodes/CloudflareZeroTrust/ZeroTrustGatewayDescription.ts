import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const gatewayOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['gatewayRule'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a Gateway rule',
				action: 'Delete a gateway rule',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List Gateway rules',
				action: 'List gateway rules',
			},
		],
		default: 'getMany',
	},
];

export const gatewayFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['gatewayRule'],
			},
		},
	},

	// ===========================================
	//         Rule ID
	// ===========================================
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the Gateway rule',
		displayOptions: {
			show: {
				resource: ['gatewayRule'],
				operation: ['delete'],
			},
		},
	},

	// ===========================================
	//         Get Many options
	// ===========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['gatewayRule'],
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
				resource: ['gatewayRule'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
