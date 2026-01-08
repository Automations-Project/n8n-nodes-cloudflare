import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

// Batch Operations
export const dnsBatchOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['batch'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Batch create DNS records', action: 'Batch create records' },
			{ name: 'Delete', value: 'delete', description: 'Batch delete DNS records', action: 'Batch delete records' },
		],
		default: 'create',
	},
];

export const dnsBatchFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['batch'] } } },
	{
		displayName: 'Records (JSON)',
		name: 'batchRecords',
		type: 'json',
		required: true,
		default: '[]',
		description: 'Array of DNS records to create/delete',
		displayOptions: { show: { resource: ['batch'] } },
	},
];

// Scan Operations
export const dnsScanOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['scan'] } },
		options: [
			{ name: 'Scan', value: 'scan', description: 'Scan DNS records', action: 'Scan DNS records' },
		],
		default: 'scan',
	},
];

export const dnsScanFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['scan'] } } },
];
