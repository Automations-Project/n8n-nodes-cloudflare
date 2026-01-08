import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const web3Operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['hostname'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a Web3 hostname',
				action: 'Create a hostname',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a Web3 hostname',
				action: 'Delete a hostname',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get Web3 hostname details',
				action: 'Get a hostname',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List Web3 hostnames',
				action: 'Get many hostnames',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a Web3 hostname',
				action: 'Update a hostname',
			},
		],
		default: 'getMany',
	},
];

export const web3Fields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['hostname'],
			},
		},
	},
	{
		displayName: 'Hostname ID',
		name: 'hostnameId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the Web3 hostname',
		displayOptions: {
			show: {
				resource: ['hostname'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'web3.example.com',
		description: 'Hostname for the Web3 gateway',
		displayOptions: {
			show: {
				resource: ['hostname'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Target',
		name: 'target',
		type: 'options',
		options: [
			{ name: 'Ethereum', value: 'ethereum' },
			{ name: 'IPFS', value: 'ipfs' },
			{ name: 'IPFS Universal Path', value: 'ipfs_universal_path' },
		],
		default: 'ipfs',
		required: true,
		description: 'Target gateway type',
		displayOptions: {
			show: {
				resource: ['hostname'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Create Options',
		name: 'createOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['hostname'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the hostname',
			},
			{
				displayName: 'DNSLink',
				name: 'dnslink',
				type: 'string',
				default: '',
				description: 'DNSLink value for IPFS (e.g., /ipns/example.com)',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['hostname'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the hostname',
			},
			{
				displayName: 'DNSLink',
				name: 'dnslink',
				type: 'string',
				default: '',
				description: 'DNSLink value for IPFS',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['hostname'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['hostname'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
