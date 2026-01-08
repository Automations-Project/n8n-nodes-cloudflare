import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const rumOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['rum'] } },
		options: [
			{ name: 'Create Site', value: 'createSite', description: 'Create a RUM site', action: 'Create a site' },
			{ name: 'Delete Site', value: 'deleteSite', description: 'Delete a RUM site', action: 'Delete a site' },
			{ name: 'Get Site', value: 'getSite', description: 'Get a RUM site', action: 'Get a site' },
			{ name: 'Get Many Sites', value: 'listSites', description: 'List RUM sites', action: 'List sites' },
			{ name: 'Update Site', value: 'updateSite', description: 'Update a RUM site', action: 'Update a site' },
			{ name: 'Get Many Rules', value: 'listRules', description: 'List RUM rules for a site', action: 'List rules' },
		],
		default: 'listSites',
	},
];

export const rumFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['rum'] } } },
	{
		displayName: 'Site ID',
		name: 'siteId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['rum'], operation: ['getSite', 'deleteSite', 'updateSite', 'listRules'] } },
	},
	{
		displayName: 'Host',
		name: 'host',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'example.com',
		displayOptions: { show: { resource: ['rum'], operation: ['createSite'] } },
	},
	{
		displayName: 'Zone Tag',
		name: 'zoneTag',
		type: 'string',
		default: '',
		description: 'Optional zone tag for the site',
		displayOptions: { show: { resource: ['rum'], operation: ['createSite', 'updateSite'] } },
	},
	{
		displayName: 'Auto Install',
		name: 'autoInstall',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['rum'], operation: ['createSite', 'updateSite'] } },
	},
];
