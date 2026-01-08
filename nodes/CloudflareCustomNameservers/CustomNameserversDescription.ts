import { INodeProperties } from 'n8n-workflow';
import { accountIdField, zoneIdField } from '../shared/SharedFields';

// ============= Account Custom Nameservers =============
export const accountNsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['accountNs'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create account custom nameserver',
				action: 'Create account custom nameserver',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete account custom nameserver',
				action: 'Delete account custom nameserver',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get account custom nameserver',
				action: 'Get account custom nameserver',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List account custom nameservers',
				action: 'Get many account custom nameservers',
			},
		],
		default: 'getMany',
	},
];

export const accountNsFields: INodeProperties[] = [
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['accountNs'],
			},
		},
	},
	{
		displayName: 'Custom NS ID',
		name: 'customNsId',
		type: 'string',
		required: true,
		default: '',
		description: 'The custom nameserver identifier',
		displayOptions: {
			show: {
				resource: ['accountNs'],
				operation: ['delete', 'get'],
			},
		},
	},
	{
		displayName: 'NS Name',
		name: 'nsName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'ns1.example.com',
		description: 'The FQDN of the custom nameserver',
		displayOptions: {
			show: {
				resource: ['accountNs'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'NS Set',
		name: 'nsSet',
		type: 'number',
		default: 1,
		description: 'The nameserver set to add this nameserver to (1-5)',
		displayOptions: {
			show: {
				resource: ['accountNs'],
				operation: ['create'],
			},
		},
	},
];

// ============= Zone Custom Nameservers =============
export const zoneNsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['zoneNs'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get zone custom nameserver configuration',
				action: 'Get zone custom nameserver configuration',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update zone custom nameserver configuration',
				action: 'Update zone custom nameserver configuration',
			},
		],
		default: 'get',
	},
];

export const zoneNsFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['zoneNs'],
			},
		},
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		required: true,
		description: 'Whether to enable zone custom nameservers',
		displayOptions: {
			show: {
				resource: ['zoneNs'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'NS Set',
		name: 'nsSet',
		type: 'number',
		default: 1,
		description: 'The nameserver set to use (1-5)',
		displayOptions: {
			show: {
				resource: ['zoneNs'],
				operation: ['update'],
			},
		},
	},
];
