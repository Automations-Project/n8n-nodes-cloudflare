import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const urlNormalizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['urlNormalization'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get URL normalization settings',
				action: 'Get URL normalization settings',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update URL normalization settings',
				action: 'Update URL normalization settings',
			},
		],
		default: 'get',
	},
];

export const urlNormalizationFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['urlNormalization'],
			},
		},
	},
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		options: [
			{ name: 'Incoming', value: 'incoming' },
			{ name: 'Both', value: 'both' },
		],
		default: 'incoming',
		required: true,
		description: 'The scope of the URL normalization',
		displayOptions: {
			show: {
				resource: ['urlNormalization'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Cloudflare', value: 'cloudflare' },
			{ name: 'RFC 3986', value: 'rfc3986' },
		],
		default: 'cloudflare',
		required: true,
		description: 'The type of URL normalization to apply',
		displayOptions: {
			show: {
				resource: ['urlNormalization'],
				operation: ['update'],
			},
		},
	},
];
