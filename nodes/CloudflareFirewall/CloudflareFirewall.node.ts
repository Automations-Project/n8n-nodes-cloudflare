import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';

import { accessRuleOperations, accessRuleFields } from './FirewallAccessRuleDescription';
import { lockdownOperations, lockdownFields } from './LockdownDescription';
import { uaRuleOperations, uaRuleFields } from './UaRuleDescription';

import { accessRuleExecute } from './FirewallAccessRuleExecute';
import { lockdownExecute, uaRuleExecute } from './FirewallExecute';

export class CloudflareFirewall implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Firewall',
		name: 'cloudflareFirewall',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Firewall (Access Rules, Lockdowns, UA Rules)',
		defaults: {
			name: 'Cloudflare Firewall',
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
						name: 'Access Rule',
						value: 'accessRule',
					},
					{
						name: 'Lockdown',
						value: 'lockdown',
					},
					{
						name: 'User Agent Rule',
						value: 'uaRule',
					},
				],
				default: 'accessRule',
			},
			...accessRuleOperations,
			...lockdownOperations,
			...uaRuleOperations,
			...accessRuleFields,
			...lockdownFields,
			...uaRuleFields,
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

				if (resource === 'accessRule') {
					result = await accessRuleExecute.call(this, i);
				} else if (resource === 'lockdown') {
					result = await lockdownExecute.call(this, i);
				} else if (resource === 'uaRule') {
					result = await uaRuleExecute.call(this, i);
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
