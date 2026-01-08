import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const zeroTrustConnectivityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['zeroTrustConnectivity'] } },
		options: [
			{ name: 'Get Settings', value: 'getSettings', description: 'Get connectivity settings', action: 'Get settings' },
			{ name: 'Update Settings', value: 'updateSettings', description: 'Update connectivity settings', action: 'Update settings' },
		],
		default: 'getSettings',
	},
];

export const zeroTrustConnectivityFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['zeroTrustConnectivity'] } } },
	{
		displayName: 'ICMP Proxy Enabled',
		name: 'icmpProxyEnabled',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['zeroTrustConnectivity'], operation: ['updateSettings'] } },
	},
	{
		displayName: 'OFFRAMP WAN Disabled',
		name: 'offrampWanDisabled',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['zeroTrustConnectivity'], operation: ['updateSettings'] } },
	},
];
