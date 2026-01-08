import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const devicesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['device'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get a device', action: 'Get a device' },
			{ name: 'Get Many', value: 'getMany', description: 'List devices', action: 'List devices' },
			{ name: 'Revoke', value: 'revoke', description: 'Revoke a device', action: 'Revoke a device' },
			{ name: 'Get Settings', value: 'getSettings', description: 'Get device settings', action: 'Get device settings' },
			{ name: 'Update Settings', value: 'updateSettings', description: 'Update device settings', action: 'Update device settings' },
			{ name: 'Get Policies', value: 'getPolicies', description: 'Get device policies', action: 'Get device policies' },
		],
		default: 'getMany',
	},
];

export const devicesFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['device'] } } },
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['device'], operation: ['get', 'revoke'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		description: 'Whether to return all results or only up to a given limit',
		default: false,
		displayOptions: { show: { resource: ['device'], operation: ['getMany'] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		description: 'Max number of results to return',
		default: 50,
		displayOptions: { show: { resource: ['device'], operation: ['getMany'], returnAll: [false] } },
	},
	{
		displayName: 'Disable Auto Fallback',
		name: 'disableAutoFallback',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['device'], operation: ['updateSettings'] } },
	},
];
