import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const keylessSslOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['keylessSsl'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a keyless SSL configuration',
				action: 'Create a keyless SSL configuration',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a keyless SSL configuration',
				action: 'Delete a keyless SSL configuration',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get keyless SSL details',
				action: 'Get a keyless SSL configuration',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List keyless SSL configurations',
				action: 'Get many keyless SSL configurations',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a keyless SSL configuration',
				action: 'Update a keyless SSL configuration',
			},
		],
		default: 'getMany',
	},
];

export const keylessSslFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['keylessSsl'],
			},
		},
	},
	{
		displayName: 'Keyless SSL ID',
		name: 'keylessSslId',
		type: 'string',
		required: true,
		default: '',
		description: 'The keyless SSL configuration identifier',
		displayOptions: {
			show: {
				resource: ['keylessSsl'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Host',
		name: 'host',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'keyless.example.com',
		description: 'The keyless SSL server hostname',
		displayOptions: {
			show: {
				resource: ['keylessSsl'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Port',
		name: 'port',
		type: 'number',
		default: 24008,
		description: 'The keyless SSL server port',
		displayOptions: {
			show: {
				resource: ['keylessSsl'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Certificate (PEM)',
		name: 'certificate',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		required: true,
		default: '',
		placeholder: '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----',
		description: 'The zone\'s SSL certificate in PEM format',
		displayOptions: {
			show: {
				resource: ['keylessSsl'],
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
				resource: ['keylessSsl'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Bundle Method',
				name: 'bundle_method',
				type: 'options',
				options: [
					{ name: 'Ubiquitous', value: 'ubiquitous' },
					{ name: 'Optimal', value: 'optimal' },
					{ name: 'Force', value: 'force' },
				],
				default: 'ubiquitous',
				description: 'The method to use for bundling the certificate chain',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'A descriptive name for the keyless SSL configuration',
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
				resource: ['keylessSsl'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the keyless SSL is enabled',
			},
			{
				displayName: 'Host',
				name: 'host',
				type: 'string',
				default: '',
				description: 'The keyless SSL server hostname',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'A descriptive name',
			},
			{
				displayName: 'Port',
				name: 'port',
				type: 'number',
				default: 24008,
				description: 'The keyless SSL server port',
			},
		],
	},
];
