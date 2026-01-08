import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

// Metadata Operations
export const kvMetadataOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['metadata'] } },
		options: [
			{ name: 'Get', value: 'get', description: 'Get key metadata', action: 'Get key metadata' },
		],
		default: 'get',
	},
];

export const kvMetadataFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['metadata'] } } },
	{
		displayName: 'Namespace Name or ID',
		name: 'metadataNamespaceId',
		type: 'options',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: { loadOptionsMethod: 'getKvNamespaces' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['metadata'] } },
	},
	{
		displayName: 'Key Name',
		name: 'metadataKeyName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['metadata'], operation: ['get'] } },
	},
];
