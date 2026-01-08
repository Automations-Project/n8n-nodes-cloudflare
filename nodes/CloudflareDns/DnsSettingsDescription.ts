import { INodeProperties } from 'n8n-workflow';
import { zoneIdField, accountIdField } from '../shared/SharedFields';

export const dnsSettingsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dnsSettings'],
			},
		},
		options: [
			{
				name: 'Get Zone Settings',
				value: 'getZone',
				description: 'Get DNS settings for a zone',
				action: 'Get zone DNS settings',
			},
			{
				name: 'Get Account Settings',
				value: 'getAccount',
				description: 'Get DNS settings for an account',
				action: 'Get account DNS settings',
			},
			{
				name: 'Update Zone Settings',
				value: 'updateZone',
				description: 'Update DNS settings for a zone',
				action: 'Update zone DNS settings',
			},
			{
				name: 'Update Account Settings',
				value: 'updateAccount',
				description: 'Update DNS settings for an account',
				action: 'Update account DNS settings',
			},
		],
		default: 'getZone',
	},
];

export const dnsSettingsFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['dnsSettings'],
				operation: ['getZone', 'updateZone'],
			},
		},
	},
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['dnsSettings'],
				operation: ['getAccount', 'updateAccount'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['dnsSettings'],
				operation: ['updateZone', 'updateAccount'],
			},
		},
		options: [
			{
				displayName: 'Foundation DNS',
				name: 'foundation_dns',
				type: 'boolean',
				default: false,
				description: 'Whether Foundation DNS is enabled',
			},
			{
				displayName: 'Multi Provider',
				name: 'multi_provider',
				type: 'boolean',
				default: false,
				description: 'Whether multi-provider DNS is enabled',
			},
			{
				displayName: 'Nameservers',
				name: 'nameservers',
				type: 'json',
				default: '{}',
				description: 'Nameserver configuration (JSON)',
			},
			{
				displayName: 'Secondary Overrides',
				name: 'secondary_overrides',
				type: 'boolean',
				default: false,
				description: 'Whether secondary DNS overrides are enabled',
			},
			{
				displayName: 'Zone Mode',
				name: 'zone_mode',
				type: 'options',
				options: [
					{ name: 'Standard', value: 'standard' },
					{ name: 'CDN Only', value: 'cdn_only' },
					{ name: 'DNS Only', value: 'dns_only' },
				],
				default: 'standard',
				description: 'Zone mode configuration',
			},
		],
	},
];
