import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const botManagementOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['config'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get bot management configuration',
				action: 'Get bot management config',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update bot management configuration',
				action: 'Update bot management config',
			},
		],
		default: 'get',
	},
];

export const botManagementFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['config'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['config'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Auto Update Model',
				name: 'auto_update_model',
				type: 'boolean',
				default: true,
				description: 'Whether to automatically update the machine learning model',
			},
			{
				displayName: 'Enable JS',
				name: 'enable_js',
				type: 'boolean',
				default: false,
				description: 'Whether to enable JavaScript detections',
			},
			{
				displayName: 'Fight Mode',
				name: 'fight_mode',
				type: 'boolean',
				default: false,
				description: 'Whether to enable Super Bot Fight Mode',
			},
			{
				displayName: 'Optimize WordPress',
				name: 'optimize_wordpress',
				type: 'boolean',
				default: false,
				description: 'Whether to optimize for WordPress',
			},
			{
				displayName: 'Static Resource Protection',
				name: 'static_resource_protection',
				type: 'boolean',
				default: false,
				description: 'Whether to protect static resources',
			},
			{
				displayName: 'Suppress Session Score',
				name: 'suppress_session_score',
				type: 'boolean',
				default: false,
				description: 'Whether to suppress session score',
			},
		],
	},
];
