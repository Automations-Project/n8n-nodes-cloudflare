import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getImages } from '../shared/SharedMethods';

import { imageOperations, imageFields } from './ImageDescription';
import { imagesKeysOperations, imagesKeysFields, imagesVariantsOperations, imagesVariantsFields } from './ImagesExtendedDescription';
import { imageExecute } from './ImageExecute';
import { imagesKeysExecute, imagesVariantsExecute } from './ImagesExtendedExecute';

export class CloudflareImages implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Images',
		name: 'cloudflareImages',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Images',
		defaults: {
			name: 'Cloudflare Images',
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
				// 'Content-Type': 'application/json', // Images might use multipart/form-data
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
						name: 'Image',
						value: 'image',
					},
					{
						name: 'Key',
						value: 'key',
					},
					{
						name: 'Variant',
						value: 'variant',
					},
				],
				default: 'image',
			},
			...imageOperations,
			...imageFields,
			...imagesKeysOperations,
			...imagesKeysFields,
			...imagesVariantsOperations,
			...imagesVariantsFields,
		],
	};

	methods = {
		loadOptions: {
			getAccounts,
			getImages,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'image') {
					result = await imageExecute.call(this, i);
				} else if (resource === 'key') {
					result = await imagesKeysExecute.call(this, i);
				} else if (resource === 'variant') {
					result = await imagesVariantsExecute.call(this, i);
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
