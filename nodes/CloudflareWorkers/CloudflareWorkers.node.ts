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

// Merged from CloudflareWorkersAI
import { aiModelOperations, aiModelFields } from '../CloudflareWorkersAI/AiModelDescription';
import { aiInferenceOperations, aiInferenceFields } from '../CloudflareWorkersAI/AiInferenceDescription';
import { aiModelExecute } from '../CloudflareWorkersAI/AiModelExecute';
import { aiInferenceExecute } from '../CloudflareWorkersAI/AiInferenceExecute';

// Merged from CloudflareWorkersForPlatforms
import { workersForPlatformsOperations, workersForPlatformsFields } from '../CloudflareWorkersForPlatforms/WorkersForPlatformsDescription';
import { workersForPlatformsExecute } from '../CloudflareWorkersForPlatforms/WorkersForPlatformsExecute';

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
		description: 'Manage Cloudflare Workers scripts, cron triggers, AI inference, and dispatch namespaces',
		defaults: {
			name: 'Cloudflare Workers',
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
						name: 'AI Inference',
						value: 'inference',
					},
					{
						name: 'AI Model',
						value: 'model',
					},
					{
						name: 'Cron Trigger',
						value: 'cronTrigger',
					},
					{
						name: 'Deployment',
						value: 'deployment',
					},
					{
						name: 'Dispatch Namespace',
						value: 'namespace',
					},
					{
						name: 'Dispatch Script',
						value: 'dispatchScript',
					},
					{
						name: 'Route',
						value: 'route',
					},
					{
						name: 'Script',
						value: 'script',
					},
					{
						name: 'Secret',
						value: 'secret',
					},
					{
						name: 'Version',
						value: 'version',
					},
				],
				default: 'script',
			},
			// Original Workers resources
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
			// Merged: Workers AI
			...aiInferenceOperations,
			...aiInferenceFields,
			...aiModelOperations,
			...aiModelFields,
			// Merged: Workers for Platforms
			...workersForPlatformsOperations,
			...workersForPlatformsFields,
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
				} else if (resource === 'inference') {
					result = await aiInferenceExecute.call(this, i);
				} else if (resource === 'model') {
					result = await aiModelExecute.call(this, i);
				} else if (resource === 'namespace' || resource === 'dispatchScript') {
					result = await workersForPlatformsExecute.call(this, i);
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
