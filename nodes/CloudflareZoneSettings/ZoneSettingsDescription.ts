import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const zoneSettingsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['zoneSetting'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get a zone setting', action: 'Get a zone setting' },
			{ name: 'Get Many', value: 'getMany', description: 'List all zone settings', action: 'List zone settings' },
			{ name: 'Update', value: 'update', description: 'Update a zone setting', action: 'Update a zone setting' },
		],
		default: 'getMany',
	},
];

export const zoneSettingsFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['zoneSetting'] } } },
	{
		displayName: 'Setting ID',
		name: 'settingId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'always_online',
		description: 'The setting identifier (e.g., always_online, browser_check, etc.)',
		displayOptions: { show: { resource: ['zoneSetting'], operation: ['get', 'update'] } },
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		required: true,
		default: '',
		description: 'The value to set (varies by setting)',
		displayOptions: { show: { resource: ['zoneSetting'], operation: ['update'] } },
	},
];
