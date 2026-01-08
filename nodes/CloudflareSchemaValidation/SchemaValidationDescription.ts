import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const schemaValidationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['schemaValidation'] } },
		options: [
			{ name: 'Create Schema', value: 'createSchema', description: 'Create a schema', action: 'Create a schema' },
			{ name: 'Delete Schema', value: 'deleteSchema', description: 'Delete a schema', action: 'Delete a schema' },
			{ name: 'Get Schema', value: 'getSchema', description: 'Get a schema', action: 'Get a schema' },
			{ name: 'Get Many Schemas', value: 'listSchemas', description: 'List schemas', action: 'List schemas' },
			{ name: 'Get Settings', value: 'getSettings', description: 'Get schema validation settings', action: 'Get settings' },
			{ name: 'Update Settings', value: 'updateSettings', description: 'Update schema validation settings', action: 'Update settings' },
		],
		default: 'listSchemas',
	},
];

export const schemaValidationFields: INodeProperties[] = [
	{ ...zoneIdField, displayOptions: { show: { resource: ['schemaValidation'] } } },
	{
		displayName: 'Schema ID',
		name: 'schemaId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['schemaValidation'], operation: ['getSchema', 'deleteSchema'] } },
	},
	{
		displayName: 'Schema Source (JSON)',
		name: 'schemaSource',
		type: 'json',
		default: '{}',
		description: 'OpenAPI schema in JSON format',
		displayOptions: { show: { resource: ['schemaValidation'], operation: ['createSchema'] } },
	},
	{
		displayName: 'Validation Enabled',
		name: 'validationEnabled',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['schemaValidation'], operation: ['updateSettings'] } },
	},
];
