import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';
import { leakedCredentialChecksOperations, leakedCredentialChecksFields } from './LeakedCredentialChecksDescription';
import { leakedCredentialChecksExecute } from './LeakedCredentialChecksExecute';

export class CloudflareLeakedCredentialChecks implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Leaked Credential Checks',
		name: 'cloudflareLeakedCredentialChecks',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare leaked credential detection',
		defaults: { name: 'Cloudflare Leaked Credential Checks' },
		inputs: ['main'],
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
				options: [{ name: 'Leaked Credential Check', value: 'leakedCredentialChecks' }],
				default: 'leakedCredentialChecks',
			},
			...leakedCredentialChecksOperations,
			...leakedCredentialChecksFields,
		],
	};

	methods = { loadOptions: { getAccounts, getZones } };

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];
				if (resource === 'leakedCredentialChecks') {
					result = await leakedCredentialChecksExecute.call(this, i);
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
