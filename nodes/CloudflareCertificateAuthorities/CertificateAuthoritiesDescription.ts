import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const certificateAuthoritiesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['certificateAuthority'] } },
		options: [
			{ name: 'Get Associations', value: 'getAssociations', description: 'Get hostname associations', action: 'Get associations' },
			{ name: 'Update Associations', value: 'updateAssociations', description: 'Update hostname associations', action: 'Update associations' },
		],
		default: 'getAssociations',
	},
];

export const certificateAuthoritiesFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['certificateAuthority'] } } },
	{
		displayName: 'Hostnames',
		name: 'hostnames',
		type: 'string',
		default: '',
		description: 'Comma-separated list of hostnames',
		displayOptions: { show: { resource: ['certificateAuthority'], operation: ['updateAssociations'] } },
	},
	{
		displayName: 'MTLS Certificate ID',
		name: 'mtlsCertificateId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['certificateAuthority'], operation: ['updateAssociations'] } },
	},
];
