import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const imageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['image'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an image',
				action: 'Delete an image',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get image details',
				action: 'Get an image',
			},
			{
				name: 'Get Blob',
				value: 'getBlob',
				description: 'Get the original image binary',
				action: 'Get image blob',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List images',
				action: 'List images',
			},
			{
				name: 'Get Stats',
				value: 'getStats',
				description: 'Get images usage statistics',
				action: 'Get images stats',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update image metadata',
				action: 'Update an image',
			},
			{
				name: 'Upload (via URL)',
				value: 'upload',
				description: 'Upload an image using a URL',
				action: 'Upload an image',
			},
		],
		default: 'getMany',
	},
];

export const imageFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['image'],
			},
		},
	},

	// ===========================================
	//         Image ID
	// ===========================================
	{
		displayName: 'Image Name or ID',
		name: 'imageId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getImages',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'ID of the image. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['delete', 'get', 'update', 'getBlob'],
			},
		},
	},

	// ===========================================
	//         Upload Options
	// ===========================================
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		description: 'URL of the image to upload',
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['upload'],
			},
		},
	},

	// ===========================================
	//         Get Many Options
	// ===========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},

	// ===========================================
	//         Update fields
	// ===========================================
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['image'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Require Signed URLs',
				name: 'requireSignedURLs',
				type: 'boolean',
				default: false,
				description: 'Whether the image requires a signed URL to access',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'User-defined metadata as JSON object',
			},
		],
	},
];
