import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';
import { zoneSettingsOperations, zoneSettingsFields } from './ZoneSettingsDescription';
import { zoneSettingsExecute } from './ZoneSettingsExecute';

export class CloudflareZoneSettings implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Zone Settings',
		name: 'cloudflareZoneSettings',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		hidden: true, // Merged into CloudflareZones node
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare zone settings',
		defaults: { name: 'Cloudflare Zone Settings' },
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
				options: [{ name: 'Zone Setting', value: 'zoneSetting' }],
				default: 'zoneSetting',
			},
			...zoneSettingsOperations,
			...zoneSettingsFields,
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
				if (resource === 'zoneSetting') {
					result = await zoneSettingsExecute.call(this, i);
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
