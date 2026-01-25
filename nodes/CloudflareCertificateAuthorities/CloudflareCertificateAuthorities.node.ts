import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';
import { certificateAuthoritiesOperations, certificateAuthoritiesFields } from './CertificateAuthoritiesDescription';
import { certificateAuthoritiesExecute } from './CertificateAuthoritiesExecute';

export class CloudflareCertificateAuthorities implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Certificate Authorities',
		name: 'cloudflareCertificateAuthorities',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		// hidden: true, // Merged into CloudflareSsl node
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage certificate authority hostname associations',
		defaults: { name: 'Cloudflare Certificate Authorities' },
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
				options: [{ name: 'Certificate Authority', value: 'certificateAuthority' }],
				default: 'certificateAuthority',
			},
			...certificateAuthoritiesOperations,
			...certificateAuthoritiesFields,
		],
	};

	methods = { loadOptions: { getAccounts, getZones } };

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];
				if (resource === 'certificateAuthority') {
					result = await certificateAuthoritiesExecute.call(this, i);
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
