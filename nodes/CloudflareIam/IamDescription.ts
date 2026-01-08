import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const iamOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['iam'] } },
		options: [
			{ name: 'Get Many Permission Groups', value: 'listPermissionGroups', description: 'List permission groups', action: 'List permission groups' },
			{ name: 'Get Permission Group', value: 'getPermissionGroup', description: 'Get a permission group', action: 'Get a permission group' },
			{ name: 'Create Resource Group', value: 'createResourceGroup', description: 'Create a resource group', action: 'Create a resource group' },
			{ name: 'Delete Resource Group', value: 'deleteResourceGroup', description: 'Delete a resource group', action: 'Delete a resource group' },
			{ name: 'Get Many Resource Groups', value: 'listResourceGroups', description: 'List resource groups', action: 'List resource groups' },
			{ name: 'Get Resource Group', value: 'getResourceGroup', description: 'Get a resource group', action: 'Get a resource group' },
		],
		default: 'listPermissionGroups',
	},
];

export const iamFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['iam'] } } },
	{
		displayName: 'Permission Group ID',
		name: 'permissionGroupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['iam'], operation: ['getPermissionGroup'] } },
	},
	{
		displayName: 'Resource Group ID',
		name: 'resourceGroupId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['iam'], operation: ['getResourceGroup', 'deleteResourceGroup'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['iam'], operation: ['createResourceGroup'] } },
	},
	{
		displayName: 'Scope (JSON)',
		name: 'scope',
		type: 'json',
		default: '{}',
		displayOptions: { show: { resource: ['iam'], operation: ['createResourceGroup'] } },
	},
];
