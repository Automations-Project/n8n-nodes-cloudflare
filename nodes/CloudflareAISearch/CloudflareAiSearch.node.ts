import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { aiSearchOperations, aiSearchFields } from './CloudflareAiSearchDescription';
import { aiSearchExecute } from './CloudflareAiSearchExecute';
import { getAccounts, getAISearchInstances } from '../shared/SharedMethods';

export class CloudflareAiSearch implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getAISearchInstances,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare AI Search',
		name: 'cloudflareAiSearch',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["ragName"]}}',
		description: 'Perform semantic search and RAG operations with Cloudflare AI Search (AutoRAG)',
		defaults: {
			name: 'Cloudflare AI Search',
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
						name: 'AI Search',
						value: 'ai_search',
					},
				],
				default: 'ai_search',
			},
			...aiSearchOperations,
			...aiSearchFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'ai_search') {
					result = await aiSearchExecute.call(this, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = (error as Error).message || 'An error occurred';
					returnData.push({
						json: {
							error: errorMessage,
							itemIndex: i,
						},
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
