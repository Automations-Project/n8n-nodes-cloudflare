import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { dnsRecordOperations, dnsRecordFields } from './DnsRecordDescription';
import { dnssecOperations, dnssecFields } from './DnssecDescription';
import { dnsSettingsOperations, dnsSettingsFields } from './DnsSettingsDescription';
import { dnsBatchOperations, dnsBatchFields, dnsScanOperations, dnsScanFields } from './DnsExtendedDescription';
import { dnsRecordExecute } from './DnsRecordExecute';
import { dnssecExecute, dnsSettingsExecute } from './DnsExecute';
import { dnsBatchExecute, dnsScanExecute } from './DnsExtendedExecute';
import { getZones, getAccounts } from '../shared/SharedMethods';

export class CloudflareDns implements INodeType {
	methods = {
		loadOptions: {
			getZones,
			getAccounts,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare DNS',
		name: 'cloudflareDns',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare DNS records, DNSSEC, and settings',
		defaults: {
			name: 'Cloudflare DNS',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'cloudflareApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.cloudflare.com/client/v4',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Batch',
						value: 'batch',
					},
					{
						name: 'DNS Record',
						value: 'dnsRecord',
					},
					{
						name: 'DNS Setting',
						value: 'dnsSettings',
					},
					{
						name: 'DNSSEC',
						value: 'dnssec',
					},
					{
						name: 'Scan',
						value: 'scan',
					},
				],
				default: 'dnsRecord',
			},
			...dnsBatchOperations,
			...dnsBatchFields,
			...dnsRecordOperations,
			...dnssecOperations,
			...dnsSettingsOperations,
			...dnsScanOperations,
			...dnsScanFields,
			...dnsRecordFields,
			...dnssecFields,
			...dnsSettingsFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'batch') {
					result = await dnsBatchExecute.call(this, i);
				} else if (resource === 'dnsRecord') {
					result = await dnsRecordExecute.call(this, i);
				} else if (resource === 'dnssec') {
					result = await dnssecExecute.call(this, i);
				} else if (resource === 'dnsSettings') {
					result = await dnsSettingsExecute.call(this, i);
				} else if (resource === 'scan') {
					result = await dnsScanExecute.call(this, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
