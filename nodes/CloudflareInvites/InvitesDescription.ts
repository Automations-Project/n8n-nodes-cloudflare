import { INodeProperties } from 'n8n-workflow';

export const invitesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['invite'] } },
		options: [
			{ name: 'Accept', value: 'accept', description: 'Accept an invite', action: 'Accept invite' },
			{ name: 'Get', value: 'get', description: 'Get an invite', action: 'Get invite' },
			{ name: 'Get Many', value: 'getMany', description: 'List pending invites', action: 'List invites' },
		],
		default: 'getMany',
	},
];

export const invitesFields: INodeProperties[] = [
	{
		displayName: 'Invite ID',
		name: 'inviteId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['invite'], operation: ['get', 'accept'] } },
	},
];
