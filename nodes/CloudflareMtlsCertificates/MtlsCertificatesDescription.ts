import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const mtlsCertOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['mtlsCertificate'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Upload an mTLS certificate',
				action: 'Create an m tls certificate',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an mTLS certificate',
				action: 'Delete an m tls certificate',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get mTLS certificate details',
				action: 'Get an m tls certificate',
			},
			{
				name: 'Get Associations',
				value: 'getAssociations',
				description: 'Get certificate associations',
				action: 'Get m tls certificate associations',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List mTLS certificates',
				action: 'Get many m tls certificates',
			},
		],
		default: 'getMany',
	},
];

export const mtlsCertFields: INodeProperties[] = [
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['mtlsCertificate'],
			},
		},
	},
	{
		displayName: 'Certificate ID',
		name: 'certificateId',
		type: 'string',
		required: true,
		default: '',
		description: 'The mTLS certificate identifier',
		displayOptions: {
			show: {
				resource: ['mtlsCertificate'],
				operation: ['delete', 'get', 'getAssociations'],
			},
		},
	},
	{
		displayName: 'Certificate (PEM)',
		name: 'certificates',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		required: true,
		default: '',
		placeholder: '-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----',
		description: 'The certificate chain in PEM format',
		displayOptions: {
			show: {
				resource: ['mtlsCertificate'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'CA',
		name: 'ca',
		type: 'boolean',
		default: false,
		required: true,
		description: 'Whether this is a CA certificate',
		displayOptions: {
			show: {
				resource: ['mtlsCertificate'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Optional name for the certificate',
		displayOptions: {
			show: {
				resource: ['mtlsCertificate'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Private Key (PEM)',
		name: 'privateKey',
		type: 'string',
		typeOptions: {
			rows: 5,
			password: true,
		},
		default: '',
		description: 'The private key in PEM format (optional for CA certs)',
		displayOptions: {
			show: {
				resource: ['mtlsCertificate'],
				operation: ['create'],
			},
		},
	},
];
