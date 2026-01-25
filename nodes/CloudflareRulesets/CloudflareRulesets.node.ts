import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones, getRulesets, getRules } from '../shared/SharedMethods';
import { rulesetOperations, rulesetFields } from './RulesetDescription';
import { rulesetsExecute } from './RulesetsExecute';

export class CloudflareRulesets implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Rulesets',
		name: 'cloudflareRulesets',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		hidden: true, // Merged into CloudflareFirewall (Security)
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare rulesets (WAF, Transform Rules, etc)',
		defaults: {
			name: 'Cloudflare Rulesets',
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
					{ name: 'Ruleset', value: 'ruleset' },
					{ name: 'Phase', value: 'phase' },
					{ name: 'Rule', value: 'rule' },
				],
				default: 'ruleset',
			},
			...rulesetOperations,
			...rulesetFields,
		],
	};

	methods = { loadOptions: { getAccounts, getZones, getRulesets, getRules } };

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];
				if (resource === 'ruleset' || resource === 'phase' || resource === 'rule') {
					result = await rulesetsExecute.call(this, i);
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
