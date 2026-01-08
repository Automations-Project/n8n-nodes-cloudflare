import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { aiModelOperations, aiModelFields } from './AiModelDescription';
import { aiInferenceOperations, aiInferenceFields } from './AiInferenceDescription';
import { aiModelExecute } from './AiModelExecute';
import { aiInferenceExecute } from './AiInferenceExecute';
import { getAccounts } from '../shared/SharedMethods';

export class CloudflareWorkersAi implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare Workers AI',
		name: 'cloudflareWorkersAi',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Run AI models on Cloudflare Workers AI',
		defaults: {
			name: 'Cloudflare Workers AI',
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
						name: 'Inference',
						value: 'inference',
					},
					{
						name: 'Model',
						value: 'model',
					},
				],
				default: 'inference',
			},
			...aiInferenceOperations,
			...aiInferenceFields,
			...aiModelOperations,
			...aiModelFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'inference') {
					result = await aiInferenceExecute.call(this, i);
				} else if (resource === 'model') {
					result = await aiModelExecute.call(this, i);
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
