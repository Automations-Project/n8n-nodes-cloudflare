import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';
import { emailRoutingRuleOperations, emailRoutingRuleFields } from './EmailRoutingRuleDescription';
import { emailRoutingAddressOperations, emailRoutingAddressFields } from './EmailRoutingAddressDescription';
import { emailRoutingSettingsOperations, emailRoutingSettingsFields } from './EmailRoutingSettingsDescription';
import {
	emailRoutingDnsOperations, emailRoutingDnsFields,
	catchAllOperations, catchAllFields
} from './EmailRoutingExtrasDescription';
import { emailRoutingExecute } from './EmailRoutingExecute';

export class CloudflareEmailRouting implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getZones,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare Email Routing',
		name: 'cloudflareEmailRouting',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Email Routing rules, addresses, and DNS',
		defaults: {
			name: 'Cloudflare Email Routing',
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
						name: 'Catch-All',
						value: 'catchAll',
					},
					{
						name: 'Destination Address',
						value: 'address',
					},
					{
						name: 'DN',
						value: 'emailRoutingDns',
					},
					{
						name: 'Rule',
						value: 'rule',
					},
					{
						name: 'Setting',
						value: 'settings',
					},
				],
				default: 'rule',
			},
			...emailRoutingRuleOperations,
			...emailRoutingRuleFields,
			...emailRoutingAddressOperations,
			...emailRoutingAddressFields,
			...emailRoutingSettingsOperations,
			...emailRoutingSettingsFields,
			...emailRoutingDnsOperations,
			...emailRoutingDnsFields,
			...catchAllOperations,
			...catchAllFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'rule' || resource === 'address' || resource === 'settings' ||
						resource === 'emailRoutingDns' || resource === 'catchAll') {
					result = await emailRoutingExecute.call(this, i);
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

