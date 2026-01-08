import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { r2BucketOperations, r2BucketFields } from './R2BucketDescription';
import { r2ObjectOperations, r2ObjectFields } from './R2ObjectDescription';
import { r2BucketExecute } from './R2BucketExecute';
import { r2ObjectExecute } from './R2ObjectExecute';
import { getAccounts, getR2Buckets } from '../shared/SharedMethods';

export class CloudflareR2 implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getR2Buckets,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare R2',
		name: 'cloudflareR2',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare R2 object storage buckets and objects',
		defaults: {
			name: 'Cloudflare R2',
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
						name: 'Bucket',
						value: 'bucket',
					},
					{
						name: 'Object',
						value: 'object',
					},
				],
				default: 'bucket',
			},
			...r2BucketOperations,
			...r2BucketFields,
			...r2ObjectOperations,
			...r2ObjectFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'bucket') {
					result = await r2BucketExecute.call(this, i);
				} else if (resource === 'object') {
					result = await r2ObjectExecute.call(this, i);
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
