import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const urlScannerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['scan'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Start a URL scan',
				action: 'Start a URL scan',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get scan results',
				action: 'Get scan results',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List recent scans',
				action: 'List recent scans',
			},
		],
		default: 'getMany',
	},
];

export const urlScannerFields: INodeProperties[] = [
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['scan'],
			},
		},
	},
	{
		displayName: 'Scan ID',
		name: 'scanId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the scan',
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		description: 'URL to scan',
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Scan Options',
		name: 'scanOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Custom Headers (JSON)',
				name: 'customHeaders',
				type: 'json',
				default: '{}',
				description: 'Custom headers to send with the request as JSON',
			},
			{
				displayName: 'Screenshots Resolutions',
				name: 'screenshotsResolutions',
				type: 'multiOptions',
				options: [
					{ name: 'Desktop', value: 'desktop' },
					{ name: 'Mobile', value: 'mobile' },
					{ name: 'Tablet', value: 'tablet' },
				],
				default: ['desktop'],
				description: 'Screenshot resolutions to capture',
			},
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'options',
				options: [
					{ name: 'Public', value: 'Public' },
					{ name: 'Unlisted', value: 'Unlisted' },
				],
				default: 'Public',
				description: 'Visibility of the scan results',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['scan'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
