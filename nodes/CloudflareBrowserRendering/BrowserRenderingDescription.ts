import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const browserRenderingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['browserRendering'] } },
		options: [
			{ name: 'Get Content', value: 'getContent', description: 'Get rendered page content', action: 'Get content' },
			{ name: 'Get Screenshot', value: 'getScreenshot', description: 'Get page screenshot', action: 'Get screenshot' },
			{ name: 'Get PDF', value: 'getPdf', description: 'Get page as PDF', action: 'Get PDF' },
			{ name: 'Scrape', value: 'scrape', description: 'Scrape page data', action: 'Scrape page' },
		],
		default: 'getContent',
	},
];

export const browserRenderingFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['browserRendering'] } } },
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		displayOptions: { show: { resource: ['browserRendering'] } },
	},
	{
		displayName: 'Wait Time (Ms)',
		name: 'waitTime',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['browserRendering'] } },
	},
];
