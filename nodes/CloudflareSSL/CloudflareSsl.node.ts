import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';

import { sslOperations, sslFields } from './SSLDescription';
import { certificatePackOperations, certificatePackFields } from './CertificatePackDescription';
import { sslExecute } from './SSLExecute';
import { certificatePackExecute } from './CertificatePackExecute';

export class CloudflareSsl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare SSL/TLS',
		name: 'cloudflareSsl',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare SSL/TLS and certificate packs',
		defaults: {
			name: 'Cloudflare SSL/TLS',
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
						name: 'Certificate Pack',
						value: 'certificatePack',
					},
					{
						name: 'Universal SSL Setting',
						value: 'universalSslSettings',
					},
				],
				default: 'universalSslSettings',
			},
			...sslOperations,
			...certificatePackOperations,
			...sslFields,
			...certificatePackFields,
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

				if (resource === 'universalSslSettings') {
					result = await sslExecute.call(this, i);
				} else if (resource === 'certificatePack') {
					result = await certificatePackExecute.call(this, i);
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

