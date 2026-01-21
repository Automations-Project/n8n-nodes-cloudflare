import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { kvNamespaceOperations, kvNamespaceFields } from './KvNamespaceDescription';
import { kvKeyOperations, kvKeyFields } from './KvKeyDescription';
import { kvMetadataOperations, kvMetadataFields } from './KvExtendedDescription';
import { kvNamespaceExecute } from './KvNamespaceExecute';
import { kvKeyExecute } from './KvKeyExecute';
import { kvMetadataExecute } from './KvExtendedExecute';
import { getAccounts, getKvNamespaces } from '../shared/SharedMethods';

export class CloudflareKv implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getKvNamespaces,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare KV',
		name: 'cloudflareKv',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Workers KV namespaces and key-value pairs',
		defaults: {
			name: 'Cloudflare KV',
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
						name: 'Key',
						value: 'key',
					},
					{
						name: 'Metadata',
						value: 'metadata',
					},
					{
						name: 'Namespace',
						value: 'namespace',
					},
				],
				default: 'key',
			},
			...kvKeyOperations,
			...kvKeyFields,
			...kvMetadataOperations,
			...kvMetadataFields,
			...kvNamespaceOperations,
			...kvNamespaceFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'key') {
					result = await kvKeyExecute.call(this, i);
				} else if (resource === 'metadata') {
					result = await kvMetadataExecute.call(this, i);
				} else if (resource === 'namespace') {
					result = await kvNamespaceExecute.call(this, i);
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
