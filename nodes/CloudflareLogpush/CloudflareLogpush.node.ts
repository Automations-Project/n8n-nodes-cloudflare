import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';
import { logpushJobOperations, logpushJobFields } from './LogpushJobDescription';
import { logpushExecute } from './LogpushExecute';

export class CloudflareLogpush implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getZones,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare Logpush',
		name: 'cloudflareLogpush',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Logpush jobs',
		defaults: {
			name: 'Cloudflare Logpush',
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
				{ name: 'Job', value: 'job' },
				{ name: 'Dataset', value: 'dataset' },
				{ name: 'Edge', value: 'edge' },
			],
				default: 'job',
			},
			{
				displayName: 'Scope',
				name: 'scope',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Zone',
						value: 'zone',
					},
					{
						name: 'Account',
						value: 'account',
					},
				],
				default: 'zone',
				description: 'The scope of the logpush job',
			},
			...logpushJobOperations,
			...logpushJobFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'job' || resource === 'dataset' || resource === 'edge') {
					result = await logpushExecute.call(this, i);
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
