import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts } from '../shared/SharedMethods';
import { devicesOperations, devicesFields } from './DevicesDescription';
import { devicesExecute } from './DevicesExecute';

export class CloudflareDevices implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Devices',
		name: 'cloudflareDevices',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		hidden: true, // Merged into CloudflareZeroTrust node
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Zero Trust devices',
		defaults: { name: 'Cloudflare Devices' },
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
				options: [{ name: 'Device', value: 'device' }],
				default: 'device',
			},
			...devicesOperations,
			...devicesFields,
		],
	};

	methods = { loadOptions: { getAccounts } };

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];
				if (resource === 'device') {
					result = await devicesExecute.call(this, i);
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
