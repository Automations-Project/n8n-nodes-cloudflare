import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { d1DatabaseOperations, d1DatabaseFields } from './D1DatabaseDescription';
import { d1QueryOperations, d1QueryFields } from './D1QueryDescription';
import { d1DatabaseExecute } from './D1DatabaseExecute';
import { d1QueryExecute } from './D1QueryExecute';
import { getAccounts, getD1Databases } from '../shared/SharedMethods';

export class CloudflareD1 implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getD1Databases,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare D1',
		name: 'cloudflareD1',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare D1 SQL databases and execute queries',
		defaults: {
			name: 'Cloudflare D1',
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
						name: 'Database',
						value: 'database',
					},
					{
						name: 'Query',
						value: 'query',
					},
				],
				default: 'query',
			},
			...d1DatabaseOperations,
			...d1DatabaseFields,
			...d1QueryOperations,
			...d1QueryFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'database') {
					result = await d1DatabaseExecute.call(this, i);
				} else if (resource === 'query') {
					result = await d1QueryExecute.call(this, i);
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
