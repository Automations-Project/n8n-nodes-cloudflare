import { INodeProperties } from 'n8n-workflow';

export const radarOperations: INodeProperties[] = [
	// HTTP Traffic Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['http'] } },
		options: [
			{ name: 'Get Summary', value: 'getSummary', description: 'Get HTTP traffic summary', action: 'Get HTTP summary' },
			{ name: 'Get Timeseries', value: 'getTimeseries', description: 'Get HTTP timeseries', action: 'Get HTTP timeseries' },
			{ name: 'Get Top Locations', value: 'getTopLocations', description: 'Get top locations by HTTP traffic', action: 'Get top locations' },
			{ name: 'Get Top ASNs', value: 'getTopAsns', description: 'Get top ASNs by HTTP traffic', action: 'Get top as ns' },
		],
		default: 'getSummary',
	},
	// BGP Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['bgp'] } },
		options: [
			{ name: 'Get Routes', value: 'getRoutes', description: 'Get BGP routes', action: 'Get BGP routes' },
			{ name: 'Get Timeseries', value: 'getTimeseries', description: 'Get BGP timeseries', action: 'Get BGP timeseries' },
			{ name: 'Get Top ASNs', value: 'getTopAsns', description: 'Get top ASNs by BGP', action: 'Get top bgp as ns' },
{ name: 'Get Top Prefixes', value: 'getTopPrefixes', description: 'Get top prefixes', action: 'Get top prefixes' },
		],
		default: 'getRoutes',
	},
	// DNS Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dns'] } },
		options: [
			{ name: 'Get Top Locations', value: 'getTopLocations', description: 'Get top locations by DNS queries', action: 'Get DNS top locations' },
			{ name: 'Get Top Domains', value: 'getTopDomains', description: 'Get top queried domains', action: 'Get top domains' },
			{ name: 'Get Timeseries', value: 'getTimeseries', description: 'Get DNS timeseries', action: 'Get DNS timeseries' },
		],
		default: 'getTopLocations',
	},
	// Attacks Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['attacks'] } },
		options: [
			{ name: 'Get Layer 3 Timeseries', value: 'getLayer3Timeseries', description: 'Get L3 attack timeseries', action: 'Get L3 attacks' },
			{ name: 'Get Layer 7 Timeseries', value: 'getLayer7Timeseries', description: 'Get L7 attack timeseries', action: 'Get L7 attacks' },
{ name: 'Get Top Attack Vectors', value: 'getTopVectors', description: 'Get top attack vectors', action: 'Get top attack vectors' },
			{ name: 'Get Top Industries', value: 'getTopIndustries', description: 'Get top targeted industries', action: 'Get top industries' },
		],
		default: 'getLayer3Timeseries',
	},
	// Quality Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['quality'] } },
		options: [
			{ name: 'Get Speed Summary', value: 'getSpeedSummary', description: 'Get speed quality summary', action: 'Get speed summary' },
			{ name: 'Get IQI Summary', value: 'getIqiSummary', description: 'Get Internet Quality Index', action: 'Get IQI summary' },
		],
		default: 'getSpeedSummary',
	},
	// Ranking Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ranking'] } },
		options: [
			{ name: 'Get Top Domains', value: 'getTopDomains', description: 'Get top ranked domains', action: 'Get top domains' },
			{ name: 'Get Domain Details', value: 'getDomainDetails', description: 'Get domain ranking details', action: 'Get domain details' },
		],
		default: 'getTopDomains',
	},
	// Entities Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['entities'] } },
		options: [
			{ name: 'Get ASN Details', value: 'getAsnDetails', description: 'Get ASN details', action: 'Get ASN details' },
			{ name: 'Get Location Details', value: 'getLocationDetails', description: 'Get location details', action: 'Get location details' },
			{ name: 'List ASNs', value: 'listAsns', description: 'List all ASNs', action: 'List ASNs' },
			{ name: 'List Locations', value: 'listLocations', description: 'List all locations', action: 'List locations' },
		],
		default: 'listAsns',
	},
];

export const radarFields: INodeProperties[] = [
	// Time Range (Common)
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'options',
		options: [
			{ name: 'Last 24 Hours', value: '1d' },
			{ name: 'Last 7 Days', value: '7d' },
			{ name: 'Last 14 Days', value: '14d' },
			{ name: 'Last 30 Days', value: '30d' },
			{ name: 'Last 90 Days', value: '90d' },
		],
		default: '7d',
		description: 'Time range for the data',
		displayOptions: { show: { resource: ['http', 'bgp', 'dns', 'attacks', 'quality', 'ranking'] } },
	},
	// ASN Field
	{
		displayName: 'ASN',
		name: 'asn',
		type: 'string',
		default: '',
		description: 'Autonomous System Number (e.g., 13335 for Cloudflare)',
		displayOptions: { show: { resource: ['entities'], operation: ['getAsnDetails'] } },
	},
	// Location Field
	{
		displayName: 'Location',
		name: 'location',
		type: 'string',
		default: '',
		placeholder: 'US',
		description: 'Two-letter country code',
		displayOptions: { show: { resource: ['entities'], operation: ['getLocationDetails'] } },
	},
	// Domain Field
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		default: '',
		placeholder: 'example.com',
		displayOptions: { show: { resource: ['ranking'], operation: ['getDomainDetails'] } },
	},
	// Limit Field
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: { show: { resource: ['http', 'bgp', 'dns', 'ranking', 'entities'], operation: ['getTopLocations', 'getTopAsns', 'getTopDomains', 'getTopPrefixes', 'getTopVectors', 'getTopIndustries', 'listAsns', 'listLocations'] } },
	},
];
