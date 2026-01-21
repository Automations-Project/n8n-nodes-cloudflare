import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { aiGatewayGatewayOperations, aiGatewayGatewayFields } from './AiGatewayGatewayDescription';
import { aiGatewayLogOperations, aiGatewayLogFields } from './AiGatewayLogDescription';
import { aiGatewayGatewayExecute } from './AiGatewayGatewayExecute';
import { aiGatewayLogExecute } from './AiGatewayLogExecute';
import { getAccounts, getAiGateways } from '../shared/SharedMethods';

export class CloudflareAiGateway implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getAiGateways,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare AI Gateway',
		name: 'cloudflareAiGateway',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare AI Gateway and logs',
		defaults: {
			name: 'Cloudflare AI Gateway',
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
						name: 'Gateway',
						value: 'gateway',
					},
					{
						name: 'Log',
						value: 'log',
					},
				],
				default: 'gateway',
			},
			...aiGatewayGatewayOperations,
			...aiGatewayGatewayFields,
			...aiGatewayLogOperations,
			...aiGatewayLogFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'gateway') {
					result = await aiGatewayGatewayExecute.call(this, i);
				} else if (resource === 'log') {
					result = await aiGatewayLogExecute.call(this, i);
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
