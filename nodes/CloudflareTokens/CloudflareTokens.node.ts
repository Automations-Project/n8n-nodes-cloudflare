import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts } from '../shared/SharedMethods';
import { tokensOperations, tokensFields } from './TokensDescription';
import { tokensExecute, accountTokensExecute } from './TokensExecute';

export class CloudflareTokens implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Tokens',
		name: 'cloudflareTokens',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare API tokens',
		defaults: { name: 'Cloudflare Tokens' },
		inputs: ['main'],
		usableAsTool: true,
		outputs: ['main'],
		credentials: [{ name: 'cloudflareApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.cloudflare.com/client/v4',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
				{ name: 'Token', value: 'token' },
				{ name: 'Account Token', value: 'accountToken' },
			],
				default: 'token',
			},
			...tokensOperations,
			...tokensFields,
		],
	};

	methods = { loadOptions: { getAccounts } };

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];
				if (resource === 'token') {
					result = await tokensExecute.call(this, i);
				} else if (resource === 'accountToken') {
					result = await accountTokensExecute.call(this, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}
				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}
		return [returnData];
	}
}
