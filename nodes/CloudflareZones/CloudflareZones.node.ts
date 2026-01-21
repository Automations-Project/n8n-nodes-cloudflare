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
import { customPagesOperations, customPagesFields } from '../CloudflareCustomPages/CustomPagesDescription';
import { snippetOperations, snippetFields, snippetRuleOperations, snippetRuleFields } from '../CloudflareSnippets/SnippetsDescription';
import { urlNormalizationOperations, urlNormalizationFields } from '../CloudflareUrlNormalization/UrlNormalizationDescription';
import { zoneSettingsOperations, zoneSettingsFields } from '../CloudflareZoneSettings/ZoneSettingsDescription';
import { zoneSubscriptionOperations, zoneSubscriptionFields } from '../CloudflareZoneSubscription/ZoneSubscriptionDescription';
import { accountNsOperations, accountNsFields, zoneNsOperations, zoneNsFields } from '../CloudflareCustomNameservers/CustomNameserversDescription';
import { pageRuleOperations, pageRuleFields } from '../CloudflarePageRules/PageRuleDescription';
import { waitingRoomOperations, waitingRoomFields } from '../CloudflareWaitingRooms/WaitingRoomDescription';
import {
	waitingRoomEventOperations, waitingRoomEventFields,
	waitingRoomRuleOperations, waitingRoomRuleFields,
	waitingRoomStatusOperations, waitingRoomStatusFields
} from '../CloudflareWaitingRooms/WaitingRoomExtrasDescription';

import { zonesZoneExecute } from './ZonesZoneExecute';
import { zonesCacheExecute } from './ZonesCacheExecute';
import { activationCheckExecute, zoneHoldExecute, zonePlanExecute } from './ZonesExtrasExecute';
import { customPagesExecute } from '../CloudflareCustomPages/CustomPagesExecute';
import { snippetExecute, snippetRuleExecute } from '../CloudflareSnippets/SnippetsExecute';
import { urlNormalizationExecute } from '../CloudflareUrlNormalization/UrlNormalizationExecute';
import { zoneSettingsExecute } from '../CloudflareZoneSettings/ZoneSettingsExecute';
import { zoneSubscriptionExecute } from '../CloudflareZoneSubscription/ZoneSubscriptionExecute';
import { accountNsExecute, zoneNsExecute } from '../CloudflareCustomNameservers/CustomNameserversExecute';
import { pageRulesExecute } from '../CloudflarePageRules/PageRulesExecute';
import { waitingRoomsExecute } from '../CloudflareWaitingRooms/WaitingRoomsExecute';
import {
	waitingRoomEventExecute,
	waitingRoomRuleExecute,
	waitingRoomStatusExecute
} from '../CloudflareWaitingRooms/WaitingRoomExtrasExecute';

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
		description: 'Manage Cloudflare zones, settings, nameservers, and more',
		defaults: {
			name: 'Cloudflare Zones',
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
						name: 'Activation Check',
						value: 'activationCheck',
					},
					{
						name: 'Cache',
						value: 'cache',
					},
					{
						name: 'Custom Nameserver (Account)',
						value: 'accountNs',
					},
					{
						name: 'Custom Nameserver (Zone)',
						value: 'zoneNs',
					},
					{
						name: 'Custom Page',
						value: 'customPage',
					},
					{
						name: 'Page Rule',
						value: 'pageRule',
					},
					{
						name: 'Snippet',
						value: 'snippet',
					},
					{
						name: 'Snippet Rule',
						value: 'snippetRule',
					},
					{
						name: 'URL Normalization',
						value: 'urlNormalization',
					},
					{
						name: 'Waiting Room',
						value: 'waitingRoom',
					},
					{
						name: 'Waiting Room Event',
						value: 'waitingRoomEvent',
					},
					{
						name: 'Waiting Room Rule',
						value: 'waitingRoomRule',
					},
					{
						name: 'Waiting Room Status',
						value: 'waitingRoomStatus',
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
					{
						name: 'Zone Setting',
						value: 'zoneSetting',
					},
					{
						name: 'Zone Subscription',
						value: 'zoneSubscription',
					},
				],
				default: 'zone',
			},
			...zonesZoneOperations,
			...zonesCacheOperations,
			...activationCheckOperations,
			...zoneHoldOperations,
			...zonePlanOperations,
			...customPagesOperations,
			...snippetOperations,
			...snippetRuleOperations,
			...urlNormalizationOperations,
			...zoneSettingsOperations,
			...zoneSubscriptionOperations,
			...accountNsOperations,
			...zoneNsOperations,
			...pageRuleOperations,
			...waitingRoomOperations,
			...waitingRoomEventOperations,
			...waitingRoomRuleOperations,
			...waitingRoomStatusOperations,
			...zonesZoneFields,
			...zonesCacheFields,
			...activationCheckFields,
			...zoneHoldFields,
			...zonePlanFields,
			...customPagesFields,
			...snippetFields,
			...snippetRuleFields,
			...urlNormalizationFields,
			...zoneSettingsFields,
			...zoneSubscriptionFields,
			...accountNsFields,
			...zoneNsFields,
			...pageRuleFields,
			...waitingRoomFields,
			...waitingRoomEventFields,
			...waitingRoomRuleFields,
			...waitingRoomStatusFields,
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
				} else if (resource === 'customPage') {
					result = await customPagesExecute.call(this, i);
				} else if (resource === 'snippet') {
					result = await snippetExecute.call(this, i);
				} else if (resource === 'snippetRule') {
					result = await snippetRuleExecute.call(this, i);
				} else if (resource === 'urlNormalization') {
					result = await urlNormalizationExecute.call(this, i);
				} else if (resource === 'zoneSetting') {
					result = await zoneSettingsExecute.call(this, i);
				} else if (resource === 'zoneSubscription') {
					result = await zoneSubscriptionExecute.call(this, i);
				} else if (resource === 'accountNs') {
					result = await accountNsExecute.call(this, i);
				} else if (resource === 'zoneNs') {
					result = await zoneNsExecute.call(this, i);
				} else if (resource === 'pageRule') {
					result = await pageRulesExecute.call(this, i);
				} else if (resource === 'waitingRoom') {
					result = await waitingRoomsExecute.call(this, i);
				} else if (resource === 'waitingRoomEvent') {
					result = await waitingRoomEventExecute.call(this, i);
				} else if (resource === 'waitingRoomRule') {
					result = await waitingRoomRuleExecute.call(this, i);
				} else if (resource === 'waitingRoomStatus') {
					result = await waitingRoomStatusExecute.call(this, i);
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

