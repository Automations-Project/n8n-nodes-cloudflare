import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const cniOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['cni'] } },
		options: [
			{ name: 'Get Many Interconnects', value: 'listInterconnects', description: 'List CNI interconnects', action: 'List interconnects' },
			{ name: 'Get Interconnect', value: 'getInterconnect', description: 'Get a CNI interconnect', action: 'Get interconnect' },
			// NOTE: Update operation is not available in the Cloudflare API for interconnects
		],
		default: 'listInterconnects',
	},
];

export const cniFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['cni'] } } },
	{
		displayName: 'Interconnect ID',
		name: 'interconnectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['cni'], operation: ['getInterconnect'] } },
	},
];
