import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const videoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a video',
				action: 'Delete a video',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a video',
				action: 'Get a video',
			},
			{
				name: 'Get Embed Code',
				value: 'getEmbed',
				description: 'Get video embed code',
				action: 'Get video embed code',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List videos',
				action: 'List videos',
			},
			{
				name: 'Get Token',
				value: 'getToken',
				description: 'Generate a signed token for video playback',
				action: 'Get video token',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update video metadata',
				action: 'Update a video',
			},
			{
				name: 'Upload (via URL)',
				value: 'upload',
				description: 'Upload a video using a URL',
				action: 'Upload a video',
			},
		],
		default: 'getMany',
	},
];

export const videoFields: INodeProperties[] = [
	// ===========================================
	//         Account ID
	// ===========================================
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
	},

	// ===========================================
	//         Video ID
	// ===========================================
	{
		displayName: 'Video Name or ID',
		name: 'videoId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getStreamVideos',
		loadOptionsDependsOn: ['accountId'],
		},
		required: true,
		default: '',
		description: 'ID of the video. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['delete', 'get', 'update', 'getEmbed', 'getToken'],
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
		description: 'URL of the video to upload',
		displayOptions: {
			show: {
				resource: ['video'],
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
				resource: ['video'],
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
				resource: ['video'],
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
				resource: ['video'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Require Signed URLs',
				name: 'requireSignedURLs',
				type: 'boolean',
				default: false,
				description: 'Whether the video requires a signed URL to play',
			},
			{
				displayName: 'Allowed Origins',
				name: 'allowedOrigins',
				type: 'string',
				default: '',
				placeholder: 'example.com,*.example.com',
				description: 'Comma-separated list of allowed origins for embedding',
			},
			{
				displayName: 'Thumbnail Timestamp',
				name: 'thumbnailTimestampPct',
				type: 'number',
				default: 0,
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					numberStepSize: 0.01,
				},
				description: 'Position in the video (0-1) to use as thumbnail',
			},
		],
	},

	// ===========================================
	//         Token options
	// ===========================================
	{
		displayName: 'Token Options',
		name: 'tokenOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['getToken'],
			},
		},
		options: [
			{
				displayName: 'Expires in (Seconds)',
				name: 'exp',
				type: 'number',
				default: 3600,
				description: 'Token expiration time in seconds',
			},
			{
				displayName: 'Download Allowed',
				name: 'downloadable',
				type: 'boolean',
				default: false,
				description: 'Whether to allow video download with this token',
			},
		],
	},
];
