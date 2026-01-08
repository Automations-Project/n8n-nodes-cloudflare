import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const apiGatewayOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['apiGateway'] } },
		options: [
			{ name: 'Get Configuration', value: 'getConfig', description: 'Get API Gateway configuration', action: 'Get API gateway configuration' },
			{ name: 'Update Configuration', value: 'updateConfig', description: 'Update API Gateway configuration', action: 'Update API gateway configuration' },
			{ name: 'Get Discovery', value: 'getDiscovery', description: 'Get discovered operations', action: 'Get discovered operations' },
			{ name: 'List Operations', value: 'listOperations', description: 'List API Gateway operations', action: 'List operations' },
			{ name: 'Create Operation', value: 'createOperation', description: 'Add an operation', action: 'Create an operation' },
			{ name: 'Delete Operation', value: 'deleteOperation', description: 'Delete an operation', action: 'Delete an operation' },
			{ name: 'Get Schema Settings', value: 'getSchemaSettings', description: 'Get schema validation settings', action: 'Get schema validation settings' },
			{ name: 'Update Schema Settings', value: 'updateSchemaSettings', description: 'Update schema validation settings', action: 'Update schema validation settings' },
		],
		default: 'listOperations',
	},
];

export const apiGatewayFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['apiGateway'] } } },
	{
		displayName: 'Operation ID',
		name: 'operationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['apiGateway'], operation: ['deleteOperation'] } },
	},
	{
		displayName: 'Endpoint',
		name: 'endpoint',
		type: 'string',
		required: true,
		default: '',
		placeholder: '/api/v1/users',
		description: 'The API endpoint path',
		displayOptions: { show: { resource: ['apiGateway'], operation: ['createOperation'] } },
	},
	{
		displayName: 'Method',
		name: 'method',
		type: 'options',
		options: [
			{ name: 'GET', value: 'GET' },
			{ name: 'POST', value: 'POST' },
			{ name: 'PUT', value: 'PUT' },
			{ name: 'PATCH', value: 'PATCH' },
			{ name: 'DELETE', value: 'DELETE' },
		],
		default: 'GET',
		required: true,
		displayOptions: { show: { resource: ['apiGateway'], operation: ['createOperation'] } },
	},
	{
		displayName: 'Host',
		name: 'host',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'api.example.com',
		displayOptions: { show: { resource: ['apiGateway'], operation: ['createOperation'] } },
	},
	{
		displayName: 'Validation Enabled',
		name: 'validationEnabled',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['apiGateway'], operation: ['updateSchemaSettings'] } },
	},
];
