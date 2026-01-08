import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const pcapsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['pcap'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a PCAP request', action: 'Create a PCAP request' },
			{ name: 'Get', value: 'get', description: 'Get a PCAP request', action: 'Get a PCAP request' },
			{ name: 'Get Many', value: 'getMany', description: 'List PCAP requests', action: 'List PCAP requests' },
			{ name: 'Download', value: 'download', description: 'Get PCAP download link', action: 'Download PCAP' },
		],
		default: 'getMany',
	},
];

export const pcapsFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['pcap'] } } },
	{
		displayName: 'PCAP ID',
		name: 'pcapId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['pcap'], operation: ['get', 'download'] } },
	},
	{
		displayName: 'System',
		name: 'system',
		type: 'options',
		options: [
			{ name: 'Magic Transit', value: 'magic-transit' },
		],
		required: true,
		default: 'magic-transit',
		displayOptions: { show: { resource: ['pcap'], operation: ['create'] } },
	},
	{
		displayName: 'Time Limit (Seconds)',
		name: 'timeLimit',
		type: 'number',
		default: 300,
		displayOptions: { show: { resource: ['pcap'], operation: ['create'] } },
	},
	{
		displayName: 'Packet Limit',
		name: 'packetLimit',
		type: 'number',
		default: 10000,
		displayOptions: { show: { resource: ['pcap'], operation: ['create'] } },
	},
];
