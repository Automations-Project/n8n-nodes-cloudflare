import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones, getRulesets, getRules } from '../shared/SharedMethods';

import { accessRuleOperations, accessRuleFields } from './FirewallAccessRuleDescription';
import { lockdownOperations, lockdownFields } from './LockdownDescription';
import { uaRuleOperations, uaRuleFields } from './UaRuleDescription';

import { botManagementOperations, botManagementFields } from '../CloudflareBotManagement/BotManagementDescription';
import { filterOperations, filterFields } from '../CloudflareFilters/FilterDescription';
import { leakedCredentialChecksOperations, leakedCredentialChecksFields } from '../CloudflareLeakedCredentialChecks/LeakedCredentialChecksDescription';
import { pageShieldOperations, pageShieldFields } from '../CloudflarePageShield/PageShieldDescription';
import { rateLimitOperations, rateLimitFields } from '../CloudflareRateLimits/RateLimitDescription';
import {
	rulesetOperations, rulesetFields,
} from '../CloudflareRulesets/RulesetDescription';

import { accessRuleExecute } from './FirewallAccessRuleExecute';
import { lockdownExecute, uaRuleExecute } from './FirewallExecute';
import { botManagementExecute } from '../CloudflareBotManagement/BotManagementExecute';
import { filterExecute } from '../CloudflareFilters/FilterExecute';
import { leakedCredentialChecksExecute } from '../CloudflareLeakedCredentialChecks/LeakedCredentialChecksExecute';
import { pageShieldExecute } from '../CloudflarePageShield/PageShieldExecute';
import { rateLimitsExecute } from '../CloudflareRateLimits/RateLimitsExecute';
import { rulesetsExecute } from '../CloudflareRulesets/RulesetsExecute';

export class CloudflareFirewall implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Security',
		name: 'cloudflareFirewall',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Security (WAF, Firewall, Bots, Page Shield)',
		defaults: {
			name: 'Cloudflare Security',
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
						name: 'Access Rule (IP/Country/ASN)',
						value: 'accessRule',
					},
					{
						name: 'Bot Management',
						value: 'botManagement',
					},
					{
						name: 'Filter (Firewall)',
						value: 'filter',
					},
					{
						name: 'Leaked Credential Check',
						value: 'leakedCredentialChecks',
					},
					{
						name: 'Lockdown Rule',
						value: 'lockdown',
					},
					{
						name: 'Page Shield',
						value: 'pageShield',
					},
					{
						name: 'Rate Limit',
						value: 'rateLimit',
					},
					{
						name: 'Ruleset (WAF/Transform)',
						value: 'ruleset',
					},
					{
						name: 'Ruleset Phase',
						value: 'phase',
					},
					{
						name: 'Ruleset Rule',
						value: 'rule',
					},
					{
						name: 'User-Agent Rule',
						value: 'uaRule',
					},
				],
				default: 'accessRule',
			},
			// Valid Firewall Resources
			...accessRuleOperations,
			...accessRuleFields,
			...lockdownOperations,
			...lockdownFields,
			...uaRuleOperations,
			...uaRuleFields,
			// Merged Security Resources
			...botManagementOperations,
			...botManagementFields,
			...filterOperations,
			...filterFields,
			...leakedCredentialChecksOperations,
			...leakedCredentialChecksFields,
			...pageShieldOperations,
			...pageShieldFields,
			...rateLimitOperations,
			...rateLimitFields,
			...rulesetOperations,
			...rulesetFields,
		],
	};

	methods = {
		loadOptions: {
			getAccounts,
			getZones,
			getRulesets,
			getRules,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'accessRule') {
					result = await accessRuleExecute.call(this, i);
				} else if (resource === 'lockdown') {
					result = await lockdownExecute.call(this, i);
				} else if (resource === 'uaRule') {
					result = await uaRuleExecute.call(this, i);
				} else if (resource === 'botManagement') {
					result = await botManagementExecute.call(this, i);
				} else if (resource === 'filter') {
					result = await filterExecute.call(this, i);
				} else if (resource === 'leakedCredentialChecks') {
					result = await leakedCredentialChecksExecute.call(this, i);
				} else if (resource === 'pageShield') {
					result = await pageShieldExecute.call(this, i);
				} else if (resource === 'rateLimit') {
					result = await rateLimitsExecute.call(this, i);
				} else if (resource === 'ruleset') {
					result = await rulesetsExecute.call(this, i);
				} else if (resource === 'rule') {
					result = await rulesetsExecute.call(this, i);
				} else if (resource === 'phase') {
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
