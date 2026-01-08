import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts } from '../shared/SharedMethods';
import { accountOperations, accountFields } from './AccountDescription';
import { memberOperations, memberFields } from './MemberDescription';
import { roleOperations, roleFields } from './RoleDescription';
import { subscriptionOperations, subscriptionFields } from './SubscriptionDescription';
import { accountsExecute } from './AccountsExecute';


export class CloudflareAccounts implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Accounts',
		name: 'cloudflareAccounts',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare accounts, members, and roles',
		defaults: {
			name: 'Cloudflare Accounts',
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
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Member',
						value: 'member',
					},
					{
						name: 'Role',
						value: 'role',
					},
					{
						name: 'Subscription',
						value: 'subscription',
					},
				],
				default: 'account',
			},
			...accountOperations,
			...memberOperations,
			...roleOperations,
			...subscriptionOperations,
			...accountFields,
			...memberFields,
			...roleFields,
			...subscriptionFields,
		],
	};

	methods = {
		loadOptions: {
			getAccounts,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'account' || resource === 'member' || resource === 'role' || resource === 'subscription') {
					result = await accountsExecute.call(this, i);
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
