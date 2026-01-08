import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { zonesZoneOperations, zonesZoneFields } from './ZonesZoneDescription';
import { zonesCacheOperations, zonesCacheFields } from './ZonesCacheDescription';
import {
	activationCheckOperations, activationCheckFields,
	zoneHoldOperations, zoneHoldFields,
	zonePlanOperations, zonePlanFields
} from './ZonesExtrasDescription';
import { zonesZoneExecute } from './ZonesZoneExecute';
import { zonesCacheExecute } from './ZonesCacheExecute';
import { activationCheckExecute, zoneHoldExecute, zonePlanExecute } from './ZonesExtrasExecute';
import { getAccounts, getZones } from '../shared/SharedMethods';

export class CloudflareZones implements INodeType {
	methods = {
		loadOptions: {
			getAccounts,
			getZones,
		},
	};

	description: INodeTypeDescription = {
		displayName: 'Cloudflare Zones',
		name: 'cloudflareZones',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare zones, cache, holds, and plans',
		defaults: {
			name: 'Cloudflare Zones',
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
						name: 'Activation Check',
						value: 'activationCheck',
					},
					{
						name: 'Cache',
						value: 'cache',
					},
					{
						name: 'Zone',
						value: 'zone',
					},
					{
						name: 'Zone Hold',
						value: 'zoneHold',
					},
					{
						name: 'Zone Plan',
						value: 'zonePlan',
					},
				],
				default: 'zone',
			},
			...zonesZoneOperations,
			...zonesCacheOperations,
			...activationCheckOperations,
			...zoneHoldOperations,
			...zonePlanOperations,
			...zonesZoneFields,
			...zonesCacheFields,
			...activationCheckFields,
			...zoneHoldFields,
			...zonePlanFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'zone') {
					result = await zonesZoneExecute.call(this, i);
				} else if (resource === 'cache') {
					result = await zonesCacheExecute.call(this, i);
				} else if (resource === 'activationCheck') {
					result = await activationCheckExecute.call(this, i);
				} else if (resource === 'zoneHold') {
					result = await zoneHoldExecute.call(this, i);
				} else if (resource === 'zonePlan') {
					result = await zonePlanExecute.call(this, i);
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

