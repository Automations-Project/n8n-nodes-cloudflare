import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

// ============= Smart Tiered Cache =============
export const smartTieredCacheOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['smartTieredCache'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete Smart Tiered Cache setting',
				action: 'Delete smart tiered cache setting',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get Smart Tiered Cache setting',
				action: 'Get smart tiered cache setting',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update Smart Tiered Cache setting',
				action: 'Update smart tiered cache setting',
			},
		],
		default: 'get',
	},
];

export const smartTieredCacheFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['smartTieredCache'],
			},
		},
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'options',
		options: [
			{ name: 'On', value: 'on' },
			{ name: 'Off', value: 'off' },
		],
		default: 'on',
		required: true,
		description: 'Enable or disable Smart Tiered Cache',
		displayOptions: {
			show: {
				resource: ['smartTieredCache'],
				operation: ['update'],
			},
		},
	},
];

// ============= Cache Variants =============
export const cacheVariantsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cacheVariants'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete cache variants',
				action: 'Delete cache variants',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get cache variants setting',
				action: 'Get cache variants',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update cache variants',
				action: 'Update cache variants',
			},
		],
		default: 'get',
	},
];

export const cacheVariantsFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['cacheVariants'],
			},
		},
	},
	{
		displayName: 'Value (JSON)',
		name: 'valueJson',
		type: 'json',
		required: true,
		default: '{}',
		placeholder: '{"avif": ["image/avif"], "webp": ["image/webp"]}',
		description: 'Cache variants configuration as JSON',
		displayOptions: {
			show: {
				resource: ['cacheVariants'],
				operation: ['update'],
			},
		},
	},
];

// ============= Regional Tiered Cache =============
export const regionalTieredCacheOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['regionalTieredCache'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get Regional Tiered Cache setting',
				action: 'Get regional tiered cache setting',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update Regional Tiered Cache setting',
				action: 'Update regional tiered cache setting',
			},
		],
		default: 'get',
	},
];

export const regionalTieredCacheFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['regionalTieredCache'],
			},
		},
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'options',
		options: [
			{ name: 'On', value: 'on' },
			{ name: 'Off', value: 'off' },
		],
		default: 'on',
		required: true,
		description: 'Enable or disable Regional Tiered Cache',
		displayOptions: {
			show: {
				resource: ['regionalTieredCache'],
				operation: ['update'],
			},
		},
	},
];
