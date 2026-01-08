import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const diagnosticsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['diagnostics'],
			},
		},
		options: [
			{
				name: 'Traceroute',
				value: 'traceroute',
				description: 'Run a traceroute from Cloudflare network',
				action: 'Run a traceroute',
			},
		],
		default: 'traceroute',
	},
];

export const diagnosticsFields: INodeProperties[] = [
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['diagnostics'],
			},
		},
	},
	{
		displayName: 'Targets (Comma Separated)',
		name: 'targets',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com, 1.2.3.4',
		description: 'Comma-separated list of targets to trace',
		displayOptions: {
			show: {
				resource: ['diagnostics'],
				operation: ['traceroute'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['diagnostics'],
				operation: ['traceroute'],
			},
		},
		options: [
			{
				displayName: 'Colos (Comma Separated)',
				name: 'colos',
				type: 'string',
				default: '',
				description: 'Cloudflare colo codes to run from',
			},
			{
				displayName: 'Packet Type',
				name: 'packet_type',
				type: 'options',
				options: [
					{ name: 'ICMP', value: 'icmp' },
					{ name: 'TCP', value: 'tcp' },
					{ name: 'UDP', value: 'udp' },
				],
				default: 'icmp',
				description: 'Type of packets to send',
			},
			{
				displayName: 'Port',
				name: 'port',
				type: 'number',
				default: 0,
				description: 'Port for TCP/UDP probes',
			},
		],
	},
];
