import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';
import { zarazOperations, zarazFields } from './ZarazDescription';
import { zarazExecute } from './ZarazExecute';

export class CloudflareZaraz implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Zaraz',
		name: 'cloudflareZaraz',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Zaraz third-party tools',
		defaults: {
			name: 'Cloudflare Zaraz',
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
						name: 'Config',
						value: 'config',
					},
					{
						name: 'History',
						value: 'history',
					},
					{
						name: 'Tool',
						value: 'tool',
					},
				],
				default: 'config',
			},
			...zarazOperations,
			...zarazFields,
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

				if (resource === 'config' || resource === 'tool' || resource === 'history') {
					result = await zarazExecute.call(this, i);
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
