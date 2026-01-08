import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const snippetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['snippet'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a snippet',
				action: 'Create a snippet',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a snippet',
				action: 'Delete a snippet',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get snippet details',
				action: 'Get a snippet',
			},
			{
				name: 'Get Content',
				value: 'getContent',
				description: 'Get snippet content (code)',
				action: 'Get snippet content',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List snippets',
				action: 'Get many snippets',
			},
		],
		default: 'getMany',
	},
];

export const snippetFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['snippet'],
			},
		},
	},
	{
		displayName: 'Snippet Name',
		name: 'snippetName',
		type: 'string',
		required: true,
		default: '',
		description: 'The snippet name/identifier',
		displayOptions: {
			show: {
				resource: ['snippet'],
				operation: ['delete', 'get', 'getContent', 'create'],
			},
		},
	},
	{
		displayName: 'Main Module',
		name: 'mainModule',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the main file in the snippet',
		displayOptions: {
			show: {
				resource: ['snippet'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Files (JSON)',
		name: 'filesJson',
		type: 'json',
		required: true,
		default: '[]',
		placeholder: '[{"name": "snippet.js", "content": "export default { async fetch(request) { return new Response(\\"Hello\\"); } }"}]',
		description: 'Array of file objects with name and content',
		displayOptions: {
			show: {
				resource: ['snippet'],
				operation: ['create'],
			},
		},
	},
];

// ============= Snippet Rules =============
export const snippetRuleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['snippetRule'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List snippet rules',
				action: 'Get many snippet rules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Replace all snippet rules',
				action: 'Update snippet rules',
			},
		],
		default: 'getMany',
	},
];

export const snippetRuleFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['snippetRule'],
			},
		},
	},
	{
		displayName: 'Rules (JSON)',
		name: 'rulesJson',
		type: 'json',
		required: true,
		default: '[]',
		placeholder: '[{"expression": "true", "description": "Always run", "enabled": true, "snippet_name": "my-snippet"}]',
		description: 'Array of rule objects',
		displayOptions: {
			show: {
				resource: ['snippetRule'],
				operation: ['update'],
			},
		},
	},
];
