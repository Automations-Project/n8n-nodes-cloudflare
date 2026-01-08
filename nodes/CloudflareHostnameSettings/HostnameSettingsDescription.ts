import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const hostnameSettingsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['hostnameSetting'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get hostname settings', action: 'Get hostname settings' },
			{ name: 'Update', value: 'update', description: 'Update hostname setting', action: 'Update hostname setting' },
			{ name: 'Delete', value: 'delete', description: 'Delete hostname setting', action: 'Delete hostname setting' },
		],
		default: 'get',
	},
];

export const hostnameSettingsFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['hostnameSetting'] } } },
	{
		displayName: 'Setting ID',
		name: 'settingId',
		type: 'options',
		options: [
			{ name: 'Ciphers', value: 'ciphers' },
			{ name: 'Min TLS Version', value: 'min_tls_version' },
			{ name: 'HTTP/2', value: 'http2' },
		],
		default: 'min_tls_version',
		displayOptions: { show: { resource: ['hostnameSetting'] } },
	},
	{
		displayName: 'Hostname',
		name: 'hostname',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['hostnameSetting'], operation: ['update', 'delete'] } },
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['hostnameSetting'], operation: ['update'] } },
	},
];
