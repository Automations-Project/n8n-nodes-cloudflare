import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

export const waitingRoomOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['waitingRoom'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a waiting room',
				action: 'Create a waiting room',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a waiting room',
				action: 'Delete a waiting room',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get waiting room details',
				action: 'Get a waiting room',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List waiting rooms',
				action: 'List waiting rooms',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get waiting room status',
				action: 'Get waiting room status',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a waiting room',
				action: 'Update a waiting room',
			},
		],
		default: 'getMany',
	},
];

export const waitingRoomFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['waitingRoom'],
			},
		},
	},
	{
		displayName: 'Waiting Room ID',
		name: 'waitingRoomId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the waiting room',
		displayOptions: {
			show: {
				resource: ['waitingRoom'],
				operation: ['delete', 'get', 'getStatus', 'update'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Unique name for the waiting room',
		displayOptions: {
			show: {
				resource: ['waitingRoom'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Host',
		name: 'host',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'shop.example.com',
		description: 'Host name for which the waiting room will be applied',
		displayOptions: {
			show: {
				resource: ['waitingRoom'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Total Active Users',
		name: 'total_active_users',
		type: 'number',
		required: true,
		default: 200,
		description: 'Total number of active users allowed in the waiting room',
		displayOptions: {
			show: {
				resource: ['waitingRoom'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'New Users Per Minute',
		name: 'new_users_per_minute',
		type: 'number',
		required: true,
		default: 200,
		description: 'Rate of new users allowed per minute',
		displayOptions: {
			show: {
				resource: ['waitingRoom'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Create Options',
		name: 'createOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['waitingRoom'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Custom Page HTML',
				name: 'custom_page_html',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'Custom HTML for the waiting room page',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description for the waiting room',
			},
			{
				displayName: 'Disable Session Renewal',
				name: 'disable_session_renewal',
				type: 'boolean',
				default: false,
				description: 'Whether to disable session renewal',
			},
			{
				displayName: 'JSON Response Enabled',
				name: 'json_response_enabled',
				type: 'boolean',
				default: false,
				description: 'Whether to return JSON instead of HTML',
			},
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '/',
				description: 'Path for the waiting room',
			},
			{
				displayName: 'Queue All',
				name: 'queue_all',
				type: 'boolean',
				default: false,
				description: 'Whether to queue all traffic',
			},
			{
				displayName: 'Queueing Method',
				name: 'queueing_method',
				type: 'options',
				options: [
					{ name: 'FIFO', value: 'fifo' },
					{ name: 'Passthrough', value: 'passthrough' },
					{ name: 'Random', value: 'random' },
					{ name: 'Reject', value: 'reject' },
				],
				default: 'fifo',
				description: 'Method used to queue visitors',
			},
			{
				displayName: 'Session Duration',
				name: 'session_duration',
				type: 'number',
				default: 5,
				description: 'Session duration in minutes',
			},
			{
				displayName: 'Suspended',
				name: 'suspended',
				type: 'boolean',
				default: false,
				description: 'Whether the waiting room is suspended',
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['waitingRoom'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description for the waiting room',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Unique name for the waiting room',
			},
			{
				displayName: 'New Users Per Minute',
				name: 'new_users_per_minute',
				type: 'number',
				default: 200,
				description: 'Rate of new users allowed per minute',
			},
			{
				displayName: 'Suspended',
				name: 'suspended',
				type: 'boolean',
				default: false,
				description: 'Whether the waiting room is suspended',
			},
			{
				displayName: 'Total Active Users',
				name: 'total_active_users',
				type: 'number',
				default: 200,
				description: 'Total number of active users allowed',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['waitingRoom'],
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
				resource: ['waitingRoom'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
