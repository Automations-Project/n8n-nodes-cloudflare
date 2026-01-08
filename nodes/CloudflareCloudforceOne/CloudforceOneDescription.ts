import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const cloudforceOneOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['cloudforceOne'] } },
		options: [
			{ name: 'Get Many Priority Requests', value: 'listRequests', description: 'List priority intelligence requests', action: 'List priority requests' },
			{ name: 'Create Priority Request', value: 'createRequest', description: 'Create a priority intelligence request', action: 'Create priority request' },
			{ name: 'Get Priority Request', value: 'getRequest', description: 'Get a priority intelligence request', action: 'Get priority request' },
			{ name: 'Delete Priority Request', value: 'deleteRequest', description: 'Delete a priority intelligence request', action: 'Delete priority request' },
		],
		default: 'listRequests',
	},
];

export const cloudforceOneFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['cloudforceOne'] } } },
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['cloudforceOne'], operation: ['getRequest', 'deleteRequest'] } },
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['cloudforceOne'], operation: ['createRequest'] } },
	},
	{
		displayName: 'Priority',
		name: 'priority',
		type: 'options',
		options: [
			{ name: 'Routine', value: 'routine' },
			{ name: 'High', value: 'high' },
			{ name: 'Urgent', value: 'urgent' },
		],
		default: 'routine',
		displayOptions: { show: { resource: ['cloudforceOne'], operation: ['createRequest'] } },
	},
];
