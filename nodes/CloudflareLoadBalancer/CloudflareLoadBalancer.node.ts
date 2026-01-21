import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts } from '../shared/SharedMethods';

import { loadBalancerOperations, loadBalancerFields } from './LoadBalancerDescription';
import { poolOperations, poolFields } from './PoolDescription';
import { monitorOperations, monitorFields } from './MonitorDescription';
import { lbRegionOperations, lbRegionFields, poolHealthOperations, poolHealthFields } from './LoadBalancerExtrasDescription';
import {
	lbPreviewOperations, lbPreviewFields,
	lbSearchOperations, lbSearchFields,
	lbReferencesOperations, lbReferencesFields,
} from './LoadBalancerAdvancedDescription';

import { loadBalancerExecute } from './LoadBalancerExecute';
import { poolExecute } from './PoolExecute';
import { monitorExecute } from './MonitorExecute';
import { lbRegionExecute, poolHealthExecute } from './LoadBalancerExtrasExecute';
import { lbPreviewExecute, lbSearchExecute, lbReferencesExecute } from './LoadBalancerAdvancedExecute';

export class CloudflareLoadBalancer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Load Balancer',
		name: 'cloudflareLoadBalancer',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Load Balancers, Pools, Monitors, and Health',
		defaults: {
			name: 'Cloudflare Load Balancer',
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
						name: 'Load Balancer',
						value: 'loadBalancer',
					},
					{
						name: 'Monitor',
						value: 'monitor',
					},
					{
						name: 'Pool',
						value: 'pool',
					},
					{
						name: 'Pool Health',
						value: 'poolHealth',
					},
					{
						name: 'Preview',
						value: 'preview',
					},
					{
						name: 'Reference',
						value: 'references',
					},
					{
						name: 'Region',
						value: 'lbRegion',
					},
					{
						name: 'Search',
						value: 'search',
					},
				],
				default: 'loadBalancer',
			},
			...loadBalancerOperations,
			...loadBalancerFields,
			...poolOperations,
			...poolFields,
			...monitorOperations,
			...monitorFields,
			...lbRegionOperations,
			...lbRegionFields,
			...poolHealthOperations,
			...poolHealthFields,
			...lbPreviewOperations,
			...lbPreviewFields,
			...lbSearchOperations,
			...lbSearchFields,
			...lbReferencesOperations,
			...lbReferencesFields,
		],
	};

	methods = {
		loadOptions: {
			getAccounts,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'loadBalancer') {
					result = await loadBalancerExecute.call(this, i);
				} else if (resource === 'pool') {
					result = await poolExecute.call(this, i);
				} else if (resource === 'monitor') {
					result = await monitorExecute.call(this, i);
				} else if (resource === 'lbRegion') {
					result = await lbRegionExecute.call(this, i);
				} else if (resource === 'poolHealth') {
					result = await poolHealthExecute.call(this, i);
				} else if (resource === 'preview') {
					result = await lbPreviewExecute.call(this, i);
				} else if (resource === 'search') {
					result = await lbSearchExecute.call(this, i);
				} else if (resource === 'references') {
					result = await lbReferencesExecute.call(this, i);
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

