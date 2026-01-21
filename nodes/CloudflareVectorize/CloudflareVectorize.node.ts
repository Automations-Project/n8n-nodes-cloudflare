import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { vectorizeIndexOperations, vectorizeIndexFields } from './VectorizeIndexDescription';
import { vectorizeVectorOperations, vectorizeVectorFields } from './VectorizeVectorDescription';
import { vectorizeIndexExecute } from './VectorizeIndexExecute';
import { vectorizeVectorExecute } from './VectorizeVectorExecute';
import { getAccounts, getVectorizeIndexes } from '../shared/SharedMethods';

export class CloudflareVectorize implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getVectorizeIndexes,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare Vectorize',
		name: 'cloudflareVectorize',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Vectorize indexes and vectors',
		defaults: {
			name: 'Cloudflare Vectorize',
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
						name: 'Index',
						value: 'index',
					},
					{
						name: 'Vector',
						value: 'vector',
					},
				],
				default: 'index',
			},
			...vectorizeIndexOperations,
			...vectorizeIndexFields,
			...vectorizeVectorOperations,
			...vectorizeVectorFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'index') {
					result = await vectorizeIndexExecute.call(this, i);
				} else if (resource === 'vector') {
					result = await vectorizeVectorExecute.call(this, i);
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
