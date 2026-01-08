import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { pagesProjectOperations, pagesProjectFields } from './PagesProjectDescription';
import { pagesDeploymentOperations, pagesDeploymentFields } from './PagesDeploymentDescription';
import { pagesDomainOperations, pagesDomainFields } from './PagesExtendedDescription';
import { pagesProjectExecute } from './PagesProjectExecute';
import { pagesDeploymentExecute } from './PagesDeploymentExecute';
import { pagesDomainExecute } from './PagesExtendedExecute';
import { getAccounts, getPagesProjects } from '../shared/SharedMethods';

export class CloudflarePages implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getPagesProjects,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare Pages',
		name: 'cloudflarePages',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Pages projects and deployments',
		defaults: {
			name: 'Cloudflare Pages',
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
						name: 'Deployment',
						value: 'deployment',
					},
					{
						name: 'Domain',
						value: 'domain',
					},
					{
						name: 'Project',
						value: 'project',
					},
				],
				default: 'project',
			},
			...pagesDeploymentOperations,
			...pagesDeploymentFields,
			...pagesDomainOperations,
			...pagesDomainFields,
			...pagesProjectOperations,
			...pagesProjectFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'deployment') {
					result = await pagesDeploymentExecute.call(this, i);
				} else if (resource === 'domain') {
					result = await pagesDomainExecute.call(this, i);
				} else if (resource === 'project') {
					result = await pagesProjectExecute.call(this, i);
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
