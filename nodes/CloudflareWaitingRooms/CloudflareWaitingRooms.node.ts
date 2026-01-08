import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';
import { waitingRoomOperations, waitingRoomFields } from './WaitingRoomDescription';
import {
	waitingRoomEventOperations, waitingRoomEventFields,
	waitingRoomRuleOperations, waitingRoomRuleFields,
	waitingRoomStatusOperations, waitingRoomStatusFields
} from './WaitingRoomExtrasDescription';
import { waitingRoomsExecute } from './WaitingRoomsExecute';
import {
	waitingRoomEventExecute,
	waitingRoomRuleExecute,
	waitingRoomStatusExecute
} from './WaitingRoomExtrasExecute';

export class CloudflareWaitingRooms implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Waiting Rooms',
		name: 'cloudflareWaitingRooms',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare waiting rooms, events, and rules',
		defaults: {
			name: 'Cloudflare Waiting Rooms',
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
						name: 'Event',
						value: 'waitingRoomEvent',
					},
					{
						name: 'Rule',
						value: 'waitingRoomRule',
					},
					{
						name: 'Status',
						value: 'waitingRoomStatus',
					},
					{
						name: 'Waiting Room',
						value: 'waitingRoom',
					},
				],
				default: 'waitingRoom',
			},
			...waitingRoomOperations,
			...waitingRoomFields,
			...waitingRoomEventOperations,
			...waitingRoomEventFields,
			...waitingRoomRuleOperations,
			...waitingRoomRuleFields,
			...waitingRoomStatusOperations,
			...waitingRoomStatusFields,
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

				if (resource === 'waitingRoom') {
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

