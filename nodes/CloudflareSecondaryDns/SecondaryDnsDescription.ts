import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const secondaryDnsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['secondaryDns'] } },
		options: [
			{ name: 'Force AXFR', value: 'forceAxfr', description: 'Force zone transfer', action: 'Force AXFR' },
			{ name: 'Get Incoming', value: 'getIncoming', description: 'Get incoming zone transfer settings', action: 'Get incoming settings' },
			{ name: 'Update Incoming', value: 'updateIncoming', description: 'Update incoming zone transfer settings', action: 'Update incoming settings' },
			{ name: 'Create Incoming', value: 'createIncoming', description: 'Create incoming zone transfer', action: 'Create incoming settings' },
			{ name: 'Delete Incoming', value: 'deleteIncoming', description: 'Delete incoming zone transfer', action: 'Delete incoming settings' },
			{ name: 'Get Outgoing', value: 'getOutgoing', description: 'Get outgoing zone transfer settings', action: 'Get outgoing settings' },
			{ name: 'Update Outgoing', value: 'updateOutgoing', description: 'Update outgoing zone transfer settings', action: 'Update outgoing settings' },
		],
		default: 'getIncoming',
	},
];

export const secondaryDnsFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['secondaryDns'] } } },
	{
		displayName: 'Primary Name Server',
		name: 'primaryNs',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'ns1.example.com',
		displayOptions: { show: { resource: ['secondaryDns'], operation: ['createIncoming'] } },
	},
	{
		displayName: 'TSIG ID',
		name: 'tsigId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['secondaryDns'], operation: ['createIncoming', 'updateIncoming'] } },
	},
	{
		displayName: 'Peers (JSON)',
		name: 'peers',
		type: 'json',
		default: '[]',
		displayOptions: { show: { resource: ['secondaryDns'], operation: ['updateOutgoing'] } },
	},
];
