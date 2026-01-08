import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const magicCloudOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['cloudConnector'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a cloud connector', action: 'Create cloud connector' },
			{ name: 'Delete', value: 'delete', description: 'Delete a cloud connector', action: 'Delete cloud connector' },
			{ name: 'Get', value: 'get', description: 'Get a cloud connector', action: 'Get cloud connector' },
			{ name: 'Get Many', value: 'getMany', description: 'List cloud connectors', action: 'List cloud connectors' },
			{ name: 'Update', value: 'update', description: 'Update a cloud connector', action: 'Update cloud connector' },
		],
		default: 'getMany',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['integration'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create integration', action: 'Create integration' },
			{ name: 'Delete', value: 'delete', description: 'Delete integration', action: 'Delete integration' },
			{ name: 'Get', value: 'get', description: 'Get integration', action: 'Get integration' },
			{ name: 'Get Many', value: 'getMany', description: 'List integrations', action: 'List integrations' },
		],
		default: 'getMany',
	},
];

export const magicCloudFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['cloudConnector', 'integration'] } } },
	{
		displayName: 'Connector ID',
		name: 'connectorId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['cloudConnector'], operation: ['get', 'delete', 'update'] } },
	},
	{
		displayName: 'Connector Name',
		name: 'connectorName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['cloudConnector'], operation: ['create'] } },
	},
	{
		displayName: 'Cloud Provider',
		name: 'cloudProvider',
		type: 'options',
		options: [
			{ name: 'AWS', value: 'aws' },
			{ name: 'Azure', value: 'azure' },
			{ name: 'GCP', value: 'gcp' },
		],
		default: 'aws',
		displayOptions: { show: { resource: ['cloudConnector'], operation: ['create'] } },
	},
	{
		displayName: 'Integration ID',
		name: 'integrationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['integration'], operation: ['get', 'delete'] } },
	},
];
