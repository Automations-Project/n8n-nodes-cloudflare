import type {
	IPollFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { cloudflareApiRequest } from '../shared/GenericFunctions';
import { getZones, getAccounts } from '../shared/SharedMethods';

interface WorkflowStaticData {
	lastCheck?: string;
	lastDnsRecordHash?: string;
	lastAuditLogId?: string;
	lastZoneStatus?: Record<string, string>;
	lastWorkerHash?: string;
	processedIds?: string[];
}

interface DnsRecord {
	id: string;
	name: string;
	type: string;
	content: string;
	modified_on?: string;
}

interface AuditLog {
	id: string;
	action: { type: string };
	actor: { email: string };
	when: string;
}

function createRecordsHash(records: DnsRecord[]): string {
	return records
		.map((r) => `${r.id}:${r.name}:${r.type}:${r.content}:${r.modified_on || ''}`)
		.sort()
		.join('|');
}

export class CloudflareTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Trigger',
		name: 'cloudflareTrigger',
		icon: 'file:cloudflare.svg',
		group: ['trigger'],
		version: 1,
		description: 'Polls Cloudflare for changes to DNS records, zones, workers, or audit logs',
		subtitle: '={{$parameter["event"]}}',
		defaults: {
			name: 'Cloudflare Trigger',
		},
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'cloudflareApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				default: 'dnsRecordChanged',
				options: [
					{
						name: 'DNS Record Changed',
						value: 'dnsRecordChanged',
						description: 'Trigger when DNS records are added, modified, or deleted',
					},
					{
						name: 'New Audit Log Entry',
						value: 'newAuditLog',
						description: 'Trigger when new audit log entries are created',
					},
					{
						name: 'Worker Script Updated',
						value: 'workerUpdated',
						description: 'Trigger when a Worker script is deployed or updated',
					},
					{
						name: 'Zone Status Changed',
						value: 'zoneStatusChanged',
						description: 'Trigger when zone status changes (active, pending, etc.)',
					},
				],
			},
			// Zone selection (for DNS and Zone events)
			{
				displayName: 'Zone Name or ID',
				name: 'zoneId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getZones',
				},
				default: '',
				required: true,
				description: 'The zone to monitor. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				displayOptions: {
					show: {
						event: ['dnsRecordChanged', 'zoneStatusChanged'],
					},
				},
			},
			// Account selection (for Audit Logs and Workers)
			{
				displayName: 'Account Name or ID',
				name: 'accountId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAccounts',
				},
				default: '',
				required: true,
				description: 'The account to monitor. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				displayOptions: {
					show: {
						event: ['newAuditLog', 'workerUpdated'],
					},
				},
			},
			// Filters
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'DNS Record Type Filter',
						name: 'dnsRecordType',
						type: 'options',
						options: [
							{ name: 'All Types', value: '' },
							{ name: 'A', value: 'A' },
							{ name: 'AAAA', value: 'AAAA' },
							{ name: 'CNAME', value: 'CNAME' },
							{ name: 'MX', value: 'MX' },
							{ name: 'TXT', value: 'TXT' },
							{ name: 'NS', value: 'NS' },
							{ name: 'SRV', value: 'SRV' },
							{ name: 'CAA', value: 'CAA' },
						],
						default: '',
						description: 'Only trigger for specific DNS record types',
						displayOptions: {
							show: {
								'/event': ['dnsRecordChanged'],
							},
						},
					},
					{
						displayName: 'Audit Log Action Filter',
						name: 'auditActionType',
						type: 'string',
						default: '',
						placeholder: 'e.g., rec_add, zone_ssl_setting_update',
						description: 'Filter audit logs by action type (leave empty for all actions)',
						displayOptions: {
							show: {
								'/event': ['newAuditLog'],
							},
						},
					},
					{
						displayName: 'Worker Script Name',
						name: 'workerScriptName',
						type: 'string',
						default: '',
						placeholder: 'e.g., my-worker',
						description: 'Monitor a specific worker script (leave empty for all scripts)',
						displayOptions: {
							show: {
								'/event': ['workerUpdated'],
							},
						},
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			getZones,
			getAccounts,
		},
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const staticData = this.getWorkflowStaticData('node') as WorkflowStaticData;
		const event = this.getNodeParameter('event') as string;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		const now = new Date().toISOString();
		const isManual = this.getMode() === 'manual';

		// Initialize state on first run
		if (!staticData.lastCheck) {
			staticData.lastCheck = now;
			staticData.processedIds = [];
		}

		let results: IDataObject[] = [];

		try {
			switch (event) {
				case 'dnsRecordChanged':
					results = await pollDnsRecords.call(this, staticData, options, isManual);
					break;
				case 'newAuditLog':
					results = await pollAuditLogs.call(this, staticData, options, isManual);
					break;
				case 'workerUpdated':
					results = await pollWorkers.call(this, staticData, options, isManual);
					break;
				case 'zoneStatusChanged':
					results = await pollZoneStatus.call(this, staticData);
					break;
			}
		} catch (error) {
			const workflow = this.getWorkflow();
			const node = this.getNode();
			this.logger.error(
				`Error in '${node.name}' node in workflow '${workflow.id}': ${(error as Error).message}`,
				{ node: node.name, workflowId: workflow.id, error },
			);
			return null;
		}

		staticData.lastCheck = now;

		if (!results.length) {
			return null;
		}

		return [this.helpers.returnJsonArray(results)];
	}
}

async function pollDnsRecords(
	this: IPollFunctions,
	staticData: WorkflowStaticData,
	options: IDataObject,
	isManual: boolean,
): Promise<IDataObject[]> {
	const zoneId = this.getNodeParameter('zoneId') as string;
	const recordType = options.dnsRecordType as string;

	const qs: IDataObject = { per_page: 100 };
	if (recordType) {
		qs.type = recordType;
	}

	const response = await cloudflareApiRequest.call(
		this,
		'GET',
		`/zones/${zoneId}/dns_records`,
		{},
		qs,
	);

	const records = (response.result as DnsRecord[]) || [];

	// Create a hash of current records to detect changes
	const currentHash = createRecordsHash(records);

	if (staticData.lastDnsRecordHash === currentHash) {
		return []; // No changes
	}

	// For manual mode, just return current records
	if (isManual) {
		staticData.lastDnsRecordHash = currentHash;
		return records.slice(0, 5).map((record) => ({
			...record,
			_event: 'dns_record_snapshot',
			_triggeredAt: new Date().toISOString(),
		}));
	}

	// Track changes - on first run or after changes detected
	staticData.lastDnsRecordHash = currentHash;

	return records.map((record) => ({
		...record,
		_event: 'dns_record_changed',
		_triggeredAt: new Date().toISOString(),
	}));
}

async function pollAuditLogs(
	this: IPollFunctions,
	staticData: WorkflowStaticData,
	options: IDataObject,
	isManual: boolean,
): Promise<IDataObject[]> {
	const accountId = this.getNodeParameter('accountId') as string;
	const actionFilter = options.auditActionType as string;

	const qs: IDataObject = {
		per_page: 50,
		direction: 'desc',
	};

	if (staticData.lastCheck) {
		qs.since = staticData.lastCheck;
	}

	if (actionFilter) {
		qs['action.type'] = actionFilter;
	}

	const response = await cloudflareApiRequest.call(
		this,
		'GET',
		`/accounts/${accountId}/audit_logs`,
		{},
		qs,
	);

	const logs = (response.result as AuditLog[]) || [];

	// Filter out already processed logs
	const processedIds = new Set(staticData.processedIds || []);
	const newLogs = logs.filter((log) => !processedIds.has(log.id));

	if (!newLogs.length) {
		return [];
	}

	// Update processed IDs (keep last 100)
	const newProcessedIds = [...processedIds, ...newLogs.map((l) => l.id)].slice(-100);
	staticData.processedIds = newProcessedIds;

	// Manual mode limit
	if (isManual) {
		return newLogs.slice(0, 3).map((log) => ({
			...log,
			_event: 'new_audit_log',
			_triggeredAt: new Date().toISOString(),
		}));
	}

	return newLogs.map((log) => ({
		...log,
		_event: 'new_audit_log',
		_triggeredAt: new Date().toISOString(),
	}));
}

async function pollWorkers(
	this: IPollFunctions,
	staticData: WorkflowStaticData,
	options: IDataObject,
	isManual: boolean,
): Promise<IDataObject[]> {
	const accountId = this.getNodeParameter('accountId') as string;
	const scriptNameFilter = options.workerScriptName as string;

	const response = await cloudflareApiRequest.call(
		this,
		'GET',
		`/accounts/${accountId}/workers/scripts`,
	);

	let scripts = (response.result as Array<{ id: string; modified_on: string }>) || [];

	if (scriptNameFilter) {
		scripts = scripts.filter((s) => s.id === scriptNameFilter);
	}

	// Create hash of current workers state
	const currentHash = scripts.map((s) => `${s.id}:${s.modified_on}`).sort().join('|');

	if (staticData.lastWorkerHash === currentHash) {
		return []; // No changes
	}

	staticData.lastWorkerHash = currentHash;

	// Manual mode limit
	if (isManual) {
		return scripts.slice(0, 3).map((script) => ({
			...script,
			_event: 'worker_updated',
			_triggeredAt: new Date().toISOString(),
		}));
	}

	return scripts.map((script) => ({
		...script,
		_event: 'worker_updated',
		_triggeredAt: new Date().toISOString(),
	}));
}

async function pollZoneStatus(
	this: IPollFunctions,
	staticData: WorkflowStaticData,
): Promise<IDataObject[]> {
	const zoneId = this.getNodeParameter('zoneId') as string;

	const response = await cloudflareApiRequest.call(this as IPollFunctions, 'GET', `/zones/${zoneId}`);

	const zone = response.result as { id: string; name: string; status: string };

	const previousStatus = staticData.lastZoneStatus?.[zoneId];
	const currentStatus = zone.status;

	if (previousStatus === currentStatus) {
		return []; // No change
	}

	// Update stored status
	staticData.lastZoneStatus = {
		...(staticData.lastZoneStatus || {}),
		[zoneId]: currentStatus,
	};

	return [
		{
			...zone,
			_event: 'zone_status_changed',
			_previousStatus: previousStatus || 'unknown',
			_currentStatus: currentStatus,
			_triggeredAt: new Date().toISOString(),
		},
	];
}
