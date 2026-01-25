import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';
import {
	accountNsOperations, accountNsFields,
	zoneNsOperations, zoneNsFields
} from './CustomNameserversDescription';
import { accountNsExecute, zoneNsExecute } from './CustomNameserversExecute';

export class CloudflareCustomNameservers implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Custom Nameservers',
		name: 'cloudflareCustomNameservers',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		// hidden: true, // Merged into CloudflareZones node
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare custom (vanity) nameservers',
		defaults: {
			name: 'Cloudflare Custom Nameservers',
		},
		inputs: ['main'],
		usableAsTool: true,
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
						name: 'Account Nameserver',
						value: 'accountNs',
					},
					{
						name: 'Zone Nameserver',
						value: 'zoneNs',
					},
				],
				default: 'accountNs',
			},
			...accountNsOperations,
			...accountNsFields,
			...zoneNsOperations,
			...zoneNsFields,
		],
	};

	methods = {
		loadOptions: {
			getAccounts,
			getZones,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'accountNs') {
					result = await accountNsExecute.call(this, i);
				} else if (resource === 'zoneNs') {
					result = await zoneNsExecute.call(this, i);
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
