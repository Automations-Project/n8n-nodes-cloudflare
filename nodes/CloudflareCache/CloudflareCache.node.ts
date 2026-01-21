import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';

import { cacheOperations, cacheFields } from './CacheDescription';
import { cacheReserveOperations, cacheReserveFields } from './CacheReserveDescription';
import {
	smartTieredCacheOperations, smartTieredCacheFields,
	cacheVariantsOperations, cacheVariantsFields,
	regionalTieredCacheOperations, regionalTieredCacheFields
} from './TieredCacheDescription';
import { cacheExecute } from './CacheExecute';
import { smartTieredCacheExecute, cacheVariantsExecute, regionalTieredCacheExecute } from './TieredCacheExecute';

export class CloudflareCache implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Cache',
		name: 'cloudflareCache',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Cache and tiered caching',
		defaults: {
			name: 'Cloudflare Cache',
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
						name: 'Cache',
						value: 'cache',
					},
					{
						name: 'Cache Reserve',
						value: 'cacheReserve',
					},
					{
						name: 'Cache Variant',
						value: 'cacheVariants',
					},
					{
						name: 'Regional Tiered Cache',
						value: 'regionalTieredCache',
					},
					{
						name: 'Smart Tiered Cache',
						value: 'smartTieredCache',
					},
				],
				default: 'cache',
			},
			...cacheOperations,
			...cacheReserveOperations,
			...smartTieredCacheOperations,
			...cacheVariantsOperations,
			...regionalTieredCacheOperations,
			...cacheFields,
			...cacheReserveFields,
			...smartTieredCacheFields,
			...cacheVariantsFields,
			...regionalTieredCacheFields,
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

				if (resource === 'cache' || resource === 'cacheReserve') {
					result = await cacheExecute.call(this, i);
				} else if (resource === 'smartTieredCache') {
					result = await smartTieredCacheExecute.call(this, i);
				} else if (resource === 'cacheVariants') {
					result = await cacheVariantsExecute.call(this, i);
				} else if (resource === 'regionalTieredCache') {
					result = await regionalTieredCacheExecute.call(this, i);
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

