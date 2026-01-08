import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';
import { customHostnameOperations, customHostnameFields } from './CustomHostnameDescription';
import { fallbackOriginOperations, fallbackOriginFields } from './FallbackOriginDescription';
import { customHostnamesExecute } from './CustomHostnamesExecute';
import { fallbackOriginExecute } from './FallbackOriginExecute';

export class CloudflareCustomHostnames implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Custom Hostnames',
		name: 'cloudflareCustomHostnames',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare custom hostnames and fallback origin (SSL for SaaS)',
		defaults: {
			name: 'Cloudflare Custom Hostnames',
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
						name: 'Custom Hostname',
						value: 'customHostname',
					},
					{
						name: 'Fallback Origin',
						value: 'fallbackOrigin',
					},
				],
				default: 'customHostname',
			},
			...customHostnameOperations,
			...fallbackOriginOperations,
			...customHostnameFields,
			...fallbackOriginFields,
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

				if (resource === 'customHostname') {
					result = await customHostnamesExecute.call(this, i);
				} else if (resource === 'fallbackOrigin') {
					result = await fallbackOriginExecute.call(this, i);
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
