import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const alertingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['policy'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a notification policy',
				action: 'Create a policy',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a notification policy',
				action: 'Delete a policy',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get policy details',
				action: 'Get a policy',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List notification policies',
				action: 'List policies',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a notification policy',
				action: 'Update a policy',
			},
		],
		default: 'getMany',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['destination'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'List notification destinations',
				action: 'List destinations',
			},
		],
		default: 'getMany',
	},
];

export const alertingFields: INodeProperties[] = [
	{
		...accountIdField,
		displayOptions: {
			show: {
				resource: ['policy', 'destination'],
			},
		},
	},
	{
		displayName: 'Policy ID',
		name: 'policyId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the notification policy',
		displayOptions: {
			show: {
				resource: ['policy'],
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
		description: 'Name of the notification policy',
		displayOptions: {
			show: {
				resource: ['policy'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Alert Type',
		name: 'alertType',
		type: 'options',
		options: [
			{ name: 'Access Custom Certificate Expiration', value: 'access_custom_certificate_expiration_type' },
			{ name: 'Advanced DDoS Attack', value: 'advanced_ddos_attack_l4_alert' },
			{ name: 'Advanced DDoS Attack L7', value: 'advanced_ddos_attack_l7_alert' },
			{ name: 'Billing Usage Alert', value: 'billing_usage_alert' },
			{ name: 'Certificate Alert', value: 'universal_ssl_event_type' },
			{ name: 'Clickhouse Alert', value: 'clickhouse_alert_fw_ent_anomaly' },
			{ name: 'Custom SSL Certificate Event', value: 'dedicated_ssl_certificate_event_type' },
			{ name: 'DOS Attack L4', value: 'dos_attack_l4' },
			{ name: 'DOS Attack L7', value: 'dos_attack_l7' },
			{ name: 'Health Check Event', value: 'health_check_status_notification' },
			{ name: 'HTTP Alert Origin Error', value: 'http_alert_origin_error' },
			{ name: 'Load Balancing Pool', value: 'load_balancing_pool_enablement_alert' },
			{ name: 'Origin Error Rate', value: 'origin_error_rate_alert' },
			{ name: 'Pages Event', value: 'pages_event_alert' },
			{ name: 'Real Origin Monitoring', value: 'real_origin_monitoring' },
			{ name: 'Script Monitor Alert', value: 'scriptmonitor_alert_new_scripts' },
			{ name: 'Secondary DNS Zone', value: 'secondary_dns_all_primaries_failing' },
			{ name: 'SSL Certificate', value: 'ssl_certificate_expiration' },
			{ name: 'Traffic Anomaly', value: 'traffic_anomalies_alert' },
			{ name: 'Tunnel Health', value: 'tunnel_health_event' },
			{ name: 'Workers Alert', value: 'workers_alert' },
			{ name: 'Zone DoS Attack', value: 'zone_dos_attack_alert' },
		],
		default: 'health_check_status_notification',
		required: true,
		description: 'Type of alert to notify on',
		displayOptions: {
			show: {
				resource: ['policy'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		description: 'Whether the policy is enabled',
		displayOptions: {
			show: {
				resource: ['policy'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Mechanisms (JSON)',
		name: 'mechanisms',
		type: 'json',
		default: '{"email": [{"id": "user@example.com"}]}',
		description: 'Notification delivery mechanisms as JSON',
		displayOptions: {
			show: {
				resource: ['policy'],
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
				resource: ['policy'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the policy',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the policy is enabled',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the policy',
			},
		],
	},
	{
		displayName: 'Destination Type',
		name: 'destinationType',
		type: 'options',
		options: [
			{ name: 'Email', value: 'email' },
			{ name: 'PagerDuty', value: 'pagerduty' },
			{ name: 'Webhooks', value: 'webhooks' },
		],
		default: 'webhooks',
		description: 'Type of notification destination to list',
		displayOptions: {
			show: {
				resource: ['destination'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['policy', 'destination'],
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
				resource: ['policy', 'destination'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
];
