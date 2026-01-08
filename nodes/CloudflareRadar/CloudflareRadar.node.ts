import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { radarOperations, radarFields } from './RadarDescription';
import {
	radarAiOperations, radarAiFields,
	radarBotsOperations, radarBotsFields,
	radarNetflowsOperations, radarNetflowsFields,
	radarEmailOperations, radarEmailFields,
	radarDatasetsOperations, radarDatasetsFields,
	radarSearchOperations, radarSearchFields,
} from './RadarExtendedDescription';
import { radarExecute } from './RadarExecute';
import {
	radarAiExecute, radarBotsExecute, radarNetflowsExecute,
	radarEmailExecute, radarDatasetsExecute, radarSearchExecute,
} from './RadarExtendedExecute';

export class CloudflareRadar implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Radar',
		name: 'cloudflareRadar',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get internet traffic, attacks, and analytics from Cloudflare Radar',
		defaults: { name: 'Cloudflare Radar' },
		inputs: ['main'],
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
				options: [
					{ name: 'AI', value: 'ai' },
					{ name: 'Attack', value: 'attacks' },
					{ name: 'BGP', value: 'bgp' },
					{ name: 'Bot', value: 'bots' },
					{ name: 'Dataset', value: 'datasets' },
					{ name: 'DN', value: 'dns' },
					{ name: 'Email Security', value: 'email' },
					{ name: 'Entity', value: 'entities' },
					{ name: 'HTTP Traffic', value: 'http' },
					{ name: 'Netflow', value: 'netflows' },
					{ name: 'Quality', value: 'quality' },
					{ name: 'Ranking', value: 'ranking' },
					{ name: 'Search', value: 'search' },
				],
				default: 'http',
			},
			...radarOperations,
			...radarFields,
			...radarAiOperations,
			...radarAiFields,
			...radarBotsOperations,
			...radarBotsFields,
			...radarNetflowsOperations,
			...radarNetflowsFields,
			...radarEmailOperations,
			...radarEmailFields,
			...radarDatasetsOperations,
			...radarDatasetsFields,
			...radarSearchOperations,
			...radarSearchFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];
				if (['http', 'bgp', 'dns', 'attacks', 'quality', 'ranking', 'entities'].includes(resource)) {
					result = await radarExecute.call(this, i);
				} else if (resource === 'ai') {
					result = await radarAiExecute.call(this, i);
				} else if (resource === 'bots') {
					result = await radarBotsExecute.call(this, i);
				} else if (resource === 'netflows') {
					result = await radarNetflowsExecute.call(this, i);
				} else if (resource === 'email') {
					result = await radarEmailExecute.call(this, i);
				} else if (resource === 'datasets') {
					result = await radarDatasetsExecute.call(this, i);
				} else if (resource === 'search') {
					result = await radarSearchExecute.call(this, i);
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
