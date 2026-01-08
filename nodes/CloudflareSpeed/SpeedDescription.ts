import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const speedOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['test'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Start a speed test',
				action: 'Start a speed test',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete speed test results',
				action: 'Delete speed test',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get speed test results',
				action: 'Get speed test results',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List speed tests',
				action: 'List speed tests',
			},
		],
		default: 'getMany',
	},
];

export const speedFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['test'],
			},
		},
	},
	{
		displayName: 'Test ID',
		name: 'testId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the speed test',
		displayOptions: {
			show: {
				resource: ['test'],
				operation: ['delete', 'get'],
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/page',
		description: 'URL to test',
		displayOptions: {
			show: {
				resource: ['test'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Test Options',
		name: 'testOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['test'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Region',
				name: 'region',
				type: 'options',
				options: [
					{ name: 'Asia Pacific - Singapore', value: 'asia-east1' },
					{ name: 'Asia Pacific - Tokyo', value: 'asia-northeast1' },
					{ name: 'Europe - London', value: 'europe-west2' },
					{ name: 'Europe - Frankfurt', value: 'europe-west3' },
					{ name: 'South America - Sao Paulo', value: 'southamerica-east1' },
					{ name: 'US - Iowa', value: 'us-central1' },
					{ name: 'US - South Carolina', value: 'us-east1' },
					{ name: 'US - Oregon', value: 'us-west1' },
				],
				default: 'us-central1',
				description: 'Test region',
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
				resource: ['test'],
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
				resource: ['test'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
