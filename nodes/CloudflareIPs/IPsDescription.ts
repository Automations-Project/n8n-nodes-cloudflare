import { INodeProperties } from 'n8n-workflow';

export const ipsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ips'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get Cloudflare IP ranges', action: 'Get cloudflare i ps' },
		],
		default: 'get',
	},
];

export const ipsFields: INodeProperties[] = [];
