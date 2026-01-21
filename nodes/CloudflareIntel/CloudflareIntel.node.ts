import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts } from '../shared/SharedMethods';
import { intelOperations, intelFields } from './IntelDescription';
import {
	intelSinkholesOperations, intelSinkholesFields,
	intelIndicatorFeedOperations, intelIndicatorFeedFields,
	intelMiscategorizationOperations, intelMiscategorizationFields,
} from './IntelExtendedDescription';
import { intelExecute } from './IntelExecute';
import { intelSinkholesExecute, intelIndicatorFeedExecute, intelMiscategorizationExecute } from './IntelExtendedExecute';

export class CloudflareIntel implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare Threat Intel',
		name: 'cloudflareIntel',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get threat intelligence about IPs and domains',
		defaults: {
			name: 'Cloudflare Threat Intel',
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
						name: 'ASN',
						value: 'asn',
					},
					{
						name: 'Domain',
						value: 'domain',
					},
					{
						name: 'Indicator Feed',
						value: 'indicatorFeed',
					},
					{
						name: 'IP Address',
						value: 'ip',
					},
					{
						name: 'Miscategorization',
						value: 'miscategorization',
					},
					{
						name: 'Sinkhole',
						value: 'sinkhole',
					},
					{
						name: 'WHOIS',
						value: 'whois',
					},
				],
				default: 'ip',
			},
			...intelOperations,
			...intelFields,
			...intelIndicatorFeedOperations,
			...intelIndicatorFeedFields,
			...intelMiscategorizationOperations,
			...intelMiscategorizationFields,
			...intelSinkholesOperations,
			...intelSinkholesFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'ip' || resource === 'domain' || resource === 'asn' || resource === 'whois') {
					result = await intelExecute.call(this, i);
				} else if (resource === 'indicatorFeed') {
					result = await intelIndicatorFeedExecute.call(this, i);
				} else if (resource === 'miscategorization') {
					result = await intelMiscategorizationExecute.call(this, i);
				} else if (resource === 'sinkhole') {
					result = await intelSinkholesExecute.call(this, i);
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
