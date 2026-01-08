import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const securityTxtOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['securityTxt'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete security.txt',
				action: 'Delete security txt',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get security.txt content',
				action: 'Get security txt',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update security.txt',
				action: 'Update security txt',
			},
		],
		default: 'get',
	},
];

export const securityTxtFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['securityTxt'],
			},
		},
	},
	{
		displayName: 'Contact',
		name: 'contact',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'mailto:security@example.com',
		description: 'Contact URI for security issues',
		displayOptions: {
			show: {
				resource: ['securityTxt'],
				operation: ['update'],
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
				resource: ['securityTxt'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Acknowledgments',
				name: 'acknowledgments',
				type: 'string',
				default: '',
				description: 'URL for acknowledgments page',
			},
			{
				displayName: 'Canonical',
				name: 'canonical',
				type: 'string',
				default: '',
				description: 'Canonical URL for this file',
			},
			{
				displayName: 'Encryption',
				name: 'encryption',
				type: 'string',
				default: '',
				description: 'URL to encryption key',
			},
			{
				displayName: 'Expires',
				name: 'expires',
				type: 'dateTime',
				default: '',
				description: 'When this file expires',
			},
			{
				displayName: 'Hiring',
				name: 'hiring',
				type: 'string',
				default: '',
				description: 'URL to security jobs page',
			},
			{
				displayName: 'Policy',
				name: 'policy',
				type: 'string',
				default: '',
				description: 'URL to vulnerability disclosure policy',
			},
			{
				displayName: 'Preferred Languages',
				name: 'preferred_languages',
				type: 'string',
				default: '',
				description: 'Preferred languages (comma-separated)',
			},
		],
	},
];
