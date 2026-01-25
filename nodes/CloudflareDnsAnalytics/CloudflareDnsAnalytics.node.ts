import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';
import { dnsAnalyticsOperations, dnsAnalyticsFields } from './DnsAnalyticsDescription';
import { dnsAnalyticsExecute } from './DnsAnalyticsExecute';

export class CloudflareDnsAnalytics implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare DNS Analytics',
		name: 'cloudflareDnsAnalytics',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		// hidden: true, // Merged into CloudflareDns node
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Query DNS analytics reports',
		defaults: { name: 'Cloudflare DNS Analytics' },
		inputs: ['main'],
		usableAsTool: true,
		outputs: ['main'],
		credentials: [{ name: 'cloudflareApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.cloudflare.com/client/v4',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [{ name: 'DNS Analytic', value: 'dnsAnalytics' }],
				default: 'dnsAnalytics',
			},
			...dnsAnalyticsOperations,
			...dnsAnalyticsFields,
		],
	};

	methods = { loadOptions: { getAccounts, getZones } };

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];
				if (resource === 'dnsAnalytics') {
					result = await dnsAnalyticsExecute.call(this, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}
				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}
		return [returnData];
	}
}
