import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getAccessApplications } from '../shared/SharedMethods';

import { accessApplicationOperations, accessApplicationFields } from './ZeroTrustAccessApplicationDescription';
import { gatewayOperations, gatewayFields } from './ZeroTrustGatewayDescription';
import {
	identityProviderOperations, identityProviderFields,
	accessGroupOperations, accessGroupFields,
	serviceTokenOperations, serviceTokenFields,
} from './ZeroTrustExtendedDescription';

import { accessApplicationExecute } from './ZeroTrustAccessApplicationExecute';
import { gatewayExecute } from './ZeroTrustGatewayExecute';
import {
	identityProviderExecute, accessGroupExecute, serviceTokenExecute,
} from './ZeroTrustExtendedExecute';

export class CloudflareZeroTrust implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Zero Trust',
		name: 'cloudflareZeroTrust',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Zero Trust (Access, Tunnels, Gateway)',
		defaults: {
			name: 'Cloudflare Zero Trust',
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
						name: 'Access Application',
						value: 'accessApplication',
					},
					{
						name: 'Access Group',
						value: 'accessGroup',
					},
					{
						name: 'Gateway Rule',
						value: 'gatewayRule',
					},
					{
						name: 'Identity Provider',
						value: 'identityProvider',
					},
					{
						name: 'Service Token',
						value: 'serviceToken',
					},
				],
				default: 'accessApplication',
			},
			...accessApplicationOperations,
			...accessApplicationFields,
			...accessGroupOperations,
			...accessGroupFields,
			...gatewayOperations,
			...gatewayFields,
			...identityProviderOperations,
			...identityProviderFields,
			...serviceTokenOperations,
			...serviceTokenFields,
		],
	};

	methods = {
		loadOptions: {
			getAccounts,
			getAccessApplications,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'accessApplication') {
					result = await accessApplicationExecute.call(this, i);
				} else if (resource === 'accessGroup') {
					result = await accessGroupExecute.call(this, i);
				} else if (resource === 'gatewayRule') {
					result = await gatewayExecute.call(this, i);
				} else if (resource === 'identityProvider') {
					result = await identityProviderExecute.call(this, i);
				} else if (resource === 'serviceToken') {
					result = await serviceTokenExecute.call(this, i);
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
