import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const abuseReportsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['abuseReport'] } },
		options: [
			{ name: 'Submit', value: 'submit', description: 'Submit an abuse report', action: 'Submit an abuse report' },
		],
		default: 'submit',
	},
];

export const abuseReportsFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['abuseReport'] } } },
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'options',
		options: [
			{ name: 'Abuse', value: 'abuse' },
			{ name: 'Copyright', value: 'copyright' },
			{ name: 'Trademark', value: 'trademark' },
			{ name: 'Phishing', value: 'phishing' },
		],
		default: 'abuse',
		displayOptions: { show: { resource: ['abuseReport'], operation: ['submit'] } },
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['abuseReport'], operation: ['submit'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		displayOptions: { show: { resource: ['abuseReport'], operation: ['submit'] } },
	},
];
