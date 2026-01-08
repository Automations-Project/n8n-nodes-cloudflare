import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const requestTracerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['requestTracer'] } },
		options: [
			{ name: 'Trace', value: 'trace', description: 'Trace a request', action: 'Trace a request' },
		],
		default: 'trace',
	},
];

export const requestTracerFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['requestTracer'] } } },
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/path',
		displayOptions: { show: { resource: ['requestTracer'], operation: ['trace'] } },
	},
	{
		displayName: 'Method',
		name: 'method',
		type: 'options',
		options: [
			{ name: 'GET', value: 'GET' },
			{ name: 'POST', value: 'POST' },
			{ name: 'PUT', value: 'PUT' },
			{ name: 'DELETE', value: 'DELETE' },
		],
		default: 'GET',
		displayOptions: { show: { resource: ['requestTracer'], operation: ['trace'] } },
	},
];
