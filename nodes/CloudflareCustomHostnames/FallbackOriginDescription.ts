import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const fallbackOriginOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['fallbackOrigin'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete the fallback origin',
				action: 'Delete fallback origin',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get the fallback origin',
				action: 'Get fallback origin',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update the fallback origin',
				action: 'Update fallback origin',
			},
		],
		default: 'get',
	},
];

export const fallbackOriginFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['fallbackOrigin'],
			},
		},
	},
	{
		displayName: 'Origin',
		name: 'origin',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'proxy-fallback.example.com',
		description: 'The fallback origin hostname',
		displayOptions: {
			show: {
				resource: ['fallbackOrigin'],
				operation: ['update'],
			},
		},
	},
];
