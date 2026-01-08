import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const warpConnectorOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['warpConnector'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a WARP connector', action: 'Create a WARP connector' },
			{ name: 'Delete', value: 'delete', description: 'Delete a WARP connector', action: 'Delete a WARP connector' },
			{ name: 'Get', value: 'get', description: 'Get a WARP connector', action: 'Get a WARP connector' },
			{ name: 'Get Many', value: 'getMany', description: 'List WARP connectors', action: 'List WARP connectors' },
			{ name: 'Get Token', value: 'getToken', description: 'Get WARP connector token', action: 'Get token' },
		],
		default: 'getMany',
	},
];

export const warpConnectorFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['warpConnector'] } } },
	{
		displayName: 'Tunnel ID',
		name: 'tunnelId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['warpConnector'], operation: ['get', 'delete', 'getToken'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['warpConnector'], operation: ['create'] } },
	},
];
