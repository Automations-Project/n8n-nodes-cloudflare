import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const secretsStoreOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['secretsStore'] } },
		options: [
			{ name: 'Create Store', value: 'createStore', description: 'Create a secrets store', action: 'Create a store' },
			{ name: 'Delete Store', value: 'deleteStore', description: 'Delete a secrets store', action: 'Delete a store' },
			{ name: 'Get Store', value: 'getStore', description: 'Get a secrets store', action: 'Get a store' },
			{ name: 'Get Many Stores', value: 'listStores', description: 'List secrets stores', action: 'List stores' },
			{ name: 'Create Secret', value: 'createSecret', description: 'Create a secret in a store', action: 'Create a secret' },
			{ name: 'Delete Secret', value: 'deleteSecret', description: 'Delete a secret', action: 'Delete a secret' },
			{ name: 'Get Many Secrets', value: 'listSecrets', description: 'List secrets in a store', action: 'List secrets' },
		],
		default: 'listStores',
	},
];

export const secretsStoreFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['secretsStore'] } } },
	{
		displayName: 'Store ID',
		name: 'storeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['secretsStore'], operation: ['getStore', 'deleteStore', 'createSecret', 'deleteSecret', 'listSecrets'] } },
	},
	{
		displayName: 'Store Name',
		name: 'storeName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['secretsStore'], operation: ['createStore'] } },
	},
	{
		displayName: 'Secret Name',
		name: 'secretName',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['secretsStore'], operation: ['createSecret', 'deleteSecret'] } },
	},
	{
		displayName: 'Secret Value',
		name: 'secretValue',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['secretsStore'], operation: ['createSecret'] } },
	},
];
