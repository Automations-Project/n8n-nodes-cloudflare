import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function waitingRoomEventExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;
	const waitingRoomId = this.getNodeParameter('waitingRoomId', index) as string;

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const eventStartTime = this.getNodeParameter('eventStartTime', index) as string;
		const eventEndTime = this.getNodeParameter('eventEndTime', index) as string;

		const body = {
			name,
			event_start_time: eventStartTime,
			event_end_time: eventEndTime,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}/events`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const eventId = this.getNodeParameter('eventId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}/events/${eventId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const eventId = this.getNodeParameter('eventId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}/events/${eventId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(
			this,
			'GET',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}/events`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'update') {
		const eventId = this.getNodeParameter('eventId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}/events/${eventId}`,
			updateFields,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

export async function waitingRoomRuleExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;
	const waitingRoomId = this.getNodeParameter('waitingRoomId', index) as string;

	if (operation === 'create') {
		const action = this.getNodeParameter('action', index) as string;
		const expression = this.getNodeParameter('expression', index) as string;
		const description = this.getNodeParameter('description', index) as string;
		const enabled = this.getNodeParameter('enabled', index) as boolean;

		const body = {
			action,
			expression,
			description,
			enabled,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}/rules`,
			body,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'delete') {
		const ruleId = this.getNodeParameter('ruleId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}/rules/${ruleId}`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'getMany') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}/rules`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'update') {
		const ruleId = this.getNodeParameter('ruleId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}/rules/${ruleId}`,
			updateFields,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	return [];
}

export async function waitingRoomStatusExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;
	const waitingRoomId = this.getNodeParameter('waitingRoomId', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}/status`,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
