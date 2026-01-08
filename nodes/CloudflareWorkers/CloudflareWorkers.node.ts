import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { workersScriptOperations, workersScriptFields } from './WorkersScriptDescription';
import { workersCronOperations, workersCronFields } from './WorkersCronDescription';
import {
	workersRouteOperations, workersRouteFields,
	workersSecretOperations, workersSecretFields,
	workersVersionOperations, workersVersionFields,
	workersDeploymentOperations, workersDeploymentFields,
} from './WorkersExtendedDescription';
import { workersScriptExecute } from './WorkersScriptExecute';
import { workersCronExecute } from './WorkersCronExecute';
import {
	workersRouteExecute, workersSecretExecute,
	workersVersionExecute, workersDeploymentExecute,
} from './WorkersExtendedExecute';
import { getAccounts, getZones, getWorkerScripts } from '../shared/SharedMethods';

export class CloudflareWorkers implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getZones,
			getWorkerScripts,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare Workers',
		name: 'cloudflareWorkers',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Workers scripts and cron triggers',
		defaults: {
			name: 'Cloudflare Workers',
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
						name: 'Script',
						value: 'script',
					},
					{
						name: 'Cron Trigger',
						value: 'cronTrigger',
					},
					{
						name: 'Route',
						value: 'route',
					},
					{
						name: 'Secret',
						value: 'secret',
					},
					{
						name: 'Version',
						value: 'version',
					},
					{
						name: 'Deployment',
						value: 'deployment',
					},
				],
				default: 'script',
			},
			...workersScriptOperations,
			...workersScriptFields,
			...workersCronOperations,
			...workersCronFields,
			...workersRouteOperations,
			...workersRouteFields,
			...workersSecretOperations,
			...workersSecretFields,
			...workersVersionOperations,
			...workersVersionFields,
			...workersDeploymentOperations,
			...workersDeploymentFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'script') {
					result = await workersScriptExecute.call(this, i);
				} else if (resource === 'cronTrigger') {
					result = await workersCronExecute.call(this, i);
				} else if (resource === 'route') {
					result = await workersRouteExecute.call(this, i);
				} else if (resource === 'secret') {
					result = await workersSecretExecute.call(this, i);
				} else if (resource === 'version') {
					result = await workersVersionExecute.call(this, i);
				} else if (resource === 'deployment') {
					result = await workersDeploymentExecute.call(this, i);
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
