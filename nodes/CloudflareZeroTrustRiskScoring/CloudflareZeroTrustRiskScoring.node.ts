import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts } from '../shared/SharedMethods';
import { zeroTrustRiskScoringOperations, zeroTrustRiskScoringFields } from './ZeroTrustRiskScoringDescription';
import { zeroTrustRiskScoringExecute } from './ZeroTrustRiskScoringExecute';

export class CloudflareZeroTrustRiskScoring implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Zero Trust Risk Scoring',
		name: 'cloudflareZeroTrustRiskScoring',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		hidden: true, // Merged into CloudflareZeroTrust node
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Zero Trust user risk scoring',
		defaults: { name: 'Cloudflare Zero Trust Risk Scoring' },
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
				options: [{ name: 'Zero Trust Risk Scoring', value: 'zeroTrustRiskScoring' }],
				default: 'zeroTrustRiskScoring',
			},
			...zeroTrustRiskScoringOperations,
			...zeroTrustRiskScoringFields,
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
				if (resource === 'zeroTrustRiskScoring') {
					result = await zeroTrustRiskScoringExecute.call(this, i);
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
