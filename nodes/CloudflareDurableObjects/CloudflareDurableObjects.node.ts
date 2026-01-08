import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { durableObjectsNamespaceOperations, durableObjectsNamespaceFields } from './DurableObjectsNamespaceDescription';
import { durableObjectsObjectOperations, durableObjectsObjectFields } from './DurableObjectsObjectDescription';
import { durableObjectsNamespaceExecute } from './DurableObjectsNamespaceExecute';
import { durableObjectsObjectExecute } from './DurableObjectsObjectExecute';
import { getAccounts, getDoNamespaces } from '../shared/SharedMethods';

export class CloudflareDurableObjects implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getDoNamespaces,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare Durable Objects',
		name: 'cloudflareDurableObjects',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Durable Objects namespaces and objects',
		defaults: {
			name: 'Cloudflare Durable Objects',
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
						name: 'Namespace',
						value: 'namespace',
					},
					{
						name: 'Object',
						value: 'object',
					},
				],
				default: 'namespace',
			},
			...durableObjectsNamespaceOperations,
			...durableObjectsNamespaceFields,
			...durableObjectsObjectOperations,
			...durableObjectsObjectFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'namespace') {
					result = await durableObjectsNamespaceExecute.call(this, i);
				} else if (resource === 'object') {
					result = await durableObjectsObjectExecute.call(this, i);
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
