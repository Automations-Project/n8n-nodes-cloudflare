import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const cacheOperations: INodeProperties[] = [
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
				description: 'Purge everything from the cache',
				action: 'Purge all files from cache',
			},
			{
				name: 'Purge URLs',
				value: 'purgeUrls',
				description: 'Purge specific URLs from the cache',
				action: 'Purge urls from cache',
			},
			{
				name: 'Purge Tags',
				value: 'purgeTags',
				description: 'Purge specific tags from the cache',
				action: 'Purge tags from cache',
			},
		],
		default: 'purgeAll',
	},
];

export const cacheFields: INodeProperties[] = [
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
	//         Purge URLs
	// ===========================================
	{
		displayName: 'URLs',
		name: 'files',
		type: 'string', // simplifies input, user can enter "url1, url2" or split via expression if array needed? No, n8n usually uses 'string' type or 'collection' for lists.
		// Usually 'string' or 'json' for list.
		// Let's use string and split by comma? Or better: 'fixedCollection' for multiple items?
		// Most Cloudflare nodes use array of strings for list inputs.
		// However, n8n `string` type implies single value unless we process it.
		// I'll use `string` and say "Comma-separated list of URLs" or process it if it's an array expression.
		default: '',
		placeholder: 'https://example.com/image.png, https://example.com/style.css',
		required: true,
		description: 'The URLs to purge from cache',
		displayOptions: {
			show: {
				resource: ['cache'],
				operation: ['purgeUrls'],
			},
		},
	},

	// ===========================================
	//         Purge Tags
	// ===========================================
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		placeholder: 'tag1, tag2',
		required: true,
		description: 'The tags to purge from cache',
		displayOptions: {
			show: {
				resource: ['cache'],
				operation: ['purgeTags'],
			},
		},
	},
];
