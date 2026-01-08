import { INodeProperties } from 'n8n-workflow';
import { zoneIdField } from '../shared/SharedFields';

// ============= Waiting Room Events =============
export const waitingRoomEventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['waitingRoomEvent'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a waiting room event',
				action: 'Create a waiting room event',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a waiting room event',
				action: 'Delete a waiting room event',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get waiting room event details',
				action: 'Get a waiting room event',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List waiting room events',
				action: 'Get many waiting room events',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a waiting room event',
				action: 'Update a waiting room event',
			},
		],
		default: 'getMany',
	},
];

export const waitingRoomEventFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['waitingRoomEvent'],
			},
		},
	},
	{
		displayName: 'Waiting Room ID',
		name: 'waitingRoomId',
		type: 'string',
		required: true,
		default: '',
		description: 'The waiting room identifier',
		displayOptions: {
			show: {
				resource: ['waitingRoomEvent'],
			},
		},
	},
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		required: true,
		default: '',
		description: 'The event identifier',
		displayOptions: {
			show: {
				resource: ['waitingRoomEvent'],
				operation: ['delete', 'get', 'update'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Event name',
		displayOptions: {
			show: {
				resource: ['waitingRoomEvent'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Event Start Time',
		name: 'eventStartTime',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'When the event starts',
		displayOptions: {
			show: {
				resource: ['waitingRoomEvent'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Event End Time',
		name: 'eventEndTime',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'When the event ends',
		displayOptions: {
			show: {
				resource: ['waitingRoomEvent'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['waitingRoomEvent'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Custom Page HTML',
				name: 'custom_page_html',
				type: 'string',
				default: '',
				description: 'Custom HTML for the event',
			},
			{
				displayName: 'Event End Time',
				name: 'event_end_time',
				type: 'dateTime',
				default: '',
				description: 'When the event ends',
			},
			{
				displayName: 'Event Start Time',
				name: 'event_start_time',
				type: 'dateTime',
				default: '',
				description: 'When the event starts',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Event name',
			},
			{
				displayName: 'New Users per Minute',
				name: 'new_users_per_minute',
				type: 'number',
				default: '',
				description: 'New users allowed per minute during event',
			},
			{
				displayName: 'Session Duration',
				name: 'session_duration',
				type: 'number',
				default: '',
				description: 'Session duration in minutes',
			},
			{
				displayName: 'Total Active Users',
				name: 'total_active_users',
				type: 'number',
				default: '',
				description: 'Max active users during event',
			},
		],
	},
];

// ============= Waiting Room Rules =============
export const waitingRoomRuleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['waitingRoomRule'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a waiting room rule',
				action: 'Create a waiting room rule',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a waiting room rule',
				action: 'Delete a waiting room rule',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List waiting room rules',
				action: 'Get many waiting room rules',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a waiting room rule',
				action: 'Update a waiting room rule',
			},
		],
		default: 'getMany',
	},
];

export const waitingRoomRuleFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['waitingRoomRule'],
			},
		},
	},
	{
		displayName: 'Waiting Room ID',
		name: 'waitingRoomId',
		type: 'string',
		required: true,
		default: '',
		description: 'The waiting room identifier',
		displayOptions: {
			show: {
				resource: ['waitingRoomRule'],
			},
		},
	},
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		default: '',
		description: 'The rule identifier',
		displayOptions: {
			show: {
				resource: ['waitingRoomRule'],
				operation: ['delete', 'update'],
			},
		},
	},
	{
		displayName: 'Action',
		name: 'action',
		type: 'options',
		options: [
			{ name: 'Bypass Waiting Room', value: 'bypass_waiting_room' },
		],
		default: 'bypass_waiting_room',
		required: true,
		description: 'The action to take',
		displayOptions: {
			show: {
				resource: ['waitingRoomRule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Expression',
		name: 'expression',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'ip.src eq 192.168.1.1',
		description: 'The rule expression',
		displayOptions: {
			show: {
				resource: ['waitingRoomRule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Rule description',
		displayOptions: {
			show: {
				resource: ['waitingRoomRule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		description: 'Whether the rule is enabled',
		displayOptions: {
			show: {
				resource: ['waitingRoomRule'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['waitingRoomRule'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				options: [
					{ name: 'Bypass Waiting Room', value: 'bypass_waiting_room' },
				],
				default: 'bypass_waiting_room',
				description: 'The action to take',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Rule description',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the rule is enabled',
			},
			{
				displayName: 'Expression',
				name: 'expression',
				type: 'string',
				default: '',
				description: 'The rule expression',
			},
		],
	},
];

// ============= Waiting Room Status =============
export const waitingRoomStatusOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['waitingRoomStatus'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get waiting room status',
				action: 'Get waiting room status',
			},
		],
		default: 'get',
	},
];

export const waitingRoomStatusFields: INodeProperties[] = [
	{
		...zoneIdField,
		displayOptions: {
			show: {
				resource: ['waitingRoomStatus'],
			},
		},
	},
	{
		displayName: 'Waiting Room ID',
		name: 'waitingRoomId',
		type: 'string',
		required: true,
		default: '',
		description: 'The waiting room identifier',
		displayOptions: {
			show: {
				resource: ['waitingRoomStatus'],
			},
		},
	},
];
