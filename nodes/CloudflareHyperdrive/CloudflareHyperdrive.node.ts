import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { hyperdriveConfigOperations, hyperdriveConfigFields } from './HyperdriveConfigDescription';
import { hyperdriveConfigExecute } from './HyperdriveConfigExecute';
import { getAccounts, getHyperdriveConfigs } from '../shared/SharedMethods';

export class CloudflareHyperdrive implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getHyperdriveConfigs,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare Hyperdrive',
		name: 'cloudflareHyperdrive',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Hyperdrive database connection configs',
		defaults: {
			name: 'Cloudflare Hyperdrive',
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
						name: 'Config',
						value: 'config',
					},
				],
				default: 'config',
			},
			...hyperdriveConfigOperations,
			...hyperdriveConfigFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'config') {
					result = await hyperdriveConfigExecute.call(this, i);
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
