import { INodeProperties } from 'n8n-workflow';

/**
 * Common Account ID field with dynamic loading
 */
export const accountIdField: INodeProperties = {
	displayName: 'Account Name or ID',
	name: 'accountId',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getAccounts',
	},
	required: true,
	default: '',
	description: 'Cloudflare Account ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
};

/**
 * Common Zone ID field with dynamic loading
 * (Often depends on accountId, but can also list all zones user has access to)
 */
export const zoneIdField: INodeProperties = {
	displayName: 'Zone Name or ID',
	name: 'zoneId',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'getZones',
	},
	required: true,
	default: '',
	description: 'Cloudflare Zone ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
};
