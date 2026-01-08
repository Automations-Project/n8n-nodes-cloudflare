import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const dnssecOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dnssec'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete DNSSEC records',
				action: 'Delete DNSSEC records',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get DNSSEC status',
				action: 'Get DNSSEC status',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Enable or update DNSSEC',
				action: 'Update DNSSEC settings',
			},
		],
		default: 'get',
	},
];

export const dnssecFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['dnssec'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{ name: 'Active', value: 'active' },
			{ name: 'Disabled', value: 'disabled' },
		],
		default: 'active',
		required: true,
		description: 'DNSSEC status',
		displayOptions: {
			show: {
				resource: ['dnssec'],
				operation: ['update'],
			},
		},
	},
];
