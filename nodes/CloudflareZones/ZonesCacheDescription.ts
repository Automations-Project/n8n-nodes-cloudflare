import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const zonesCacheOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cache'],
			},
		},
		options: [
			{
				name: 'Purge All',
				value: 'purgeAll',
				description: 'Purge all cached content for a zone',
				action: 'Purge all cache',
			},
			{
				name: 'Purge by Prefix',
				value: 'purgePrefix',
				description: 'Purge cached content by URL prefix',
				action: 'Purge cache by prefix',
			},
			{
				name: 'Purge by Tags',
				value: 'purgeTags',
				description: 'Purge cached content by cache tags',
				action: 'Purge cache by tags',
			},
			{
				name: 'Purge by URLs',
				value: 'purgeUrls',
				description: 'Purge specific cached URLs',
				action: 'Purge cache by ur ls',
			},
		],
		default: 'purgeUrls',
	},
];

export const zonesCacheFields: INodeProperties[] = [
	// ===========================================
	//         Zone ID
	// ===========================================
	// ===========================================
	//         Zone ID
	// ===========================================
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['cache'],
			},
		},
	},

	// ===========================================
	//         Purge by URLs
	// ===========================================
	{
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/page1, https://example.com/page2',
		description: 'Comma-separated list of URLs to purge',
		displayOptions: {
			show: {
				resource: ['cache'],
				operation: ['purgeUrls'],
			},
		},
	},

	// ===========================================
	//         Purge by Tags
	// ===========================================
	{
		displayName: 'Cache Tags',
		name: 'tags',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'tag1, tag2, tag3',
		description: 'Comma-separated list of cache tags to purge',
		displayOptions: {
			show: {
				resource: ['cache'],
				operation: ['purgeTags'],
			},
		},
	},

	// ===========================================
	//         Purge by Prefix
	// ===========================================
	{
		displayName: 'Prefixes',
		name: 'prefixes',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/images/, https://example.com/css/',
		description: 'Comma-separated list of URL prefixes to purge',
		displayOptions: {
			show: {
				resource: ['cache'],
				operation: ['purgePrefix'],
			},
		},
	},
];
