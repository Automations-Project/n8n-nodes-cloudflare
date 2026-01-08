import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

// ============= Load Balancer Regions =============
export const lbRegionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lbRegion'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific region',
				action: 'Get a region',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List all regions',
				action: 'Get many regions',
			},
		],
		default: 'getMany',
	},
];

export const lbRegionFields: INodeProperties[] = [
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['lbRegion'],
			},
		},
	},
	{
		displayName: 'Region Code',
		name: 'regionCode',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'WNAM',
		description: 'The region code (e.g., WNAM, ENAM, WEU)',
		displayOptions: {
			show: {
				resource: ['lbRegion'],
				operation: ['get'],
			},
		},
	},
];

// ============= Pool Health =============
export const poolHealthOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['poolHealth'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get pool health details',
				action: 'Get pool health',
			},
			{
				name: 'Preview',
				value: 'preview',
				description: 'Preview pool health for a monitor',
				action: 'Preview pool health',
			},
		],
		default: 'get',
	},
];

export const poolHealthFields: INodeProperties[] = [
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['poolHealth'],
			},
		},
	},
	{
		displayName: 'Pool ID',
		name: 'poolId',
		type: 'string',
		required: true,
		default: '',
		description: 'The pool identifier',
		displayOptions: {
			show: {
				resource: ['poolHealth'],
			},
		},
	},
	{
		displayName: 'Monitor ID',
		name: 'monitorId',
		type: 'string',
		required: true,
		default: '',
		description: 'The monitor identifier',
		displayOptions: {
			show: {
				resource: ['poolHealth'],
				operation: ['preview'],
			},
		},
	},
];
