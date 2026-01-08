import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function waitingRoomsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const host = this.getNodeParameter('host', index) as string;
		const totalActiveUsers = this.getNodeParameter('total_active_users', index) as number;
		const newUsersPerMinute = this.getNodeParameter('new_users_per_minute', index) as number;
		const createOptions = this.getNodeParameter('createOptions', index) as IDataObject;

		const body: IDataObject = {
			name,
			host,
			total_active_users: totalActiveUsers,
			new_users_per_minute: newUsersPerMinute,
		};

		Object.assign(body, createOptions);

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/waiting_rooms`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const waitingRoomId = this.getNodeParameter('waitingRoomId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}`,
		);
		return [{ json: { success: true, waitingRoomId } }];
	}

	if (operation === 'get') {
		const waitingRoomId = this.getNodeParameter('waitingRoomId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/waiting_rooms`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/waiting_rooms`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'getStatus') {
		const waitingRoomId = this.getNodeParameter('waitingRoomId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}/status`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const waitingRoomId = this.getNodeParameter('waitingRoomId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = { ...updateFields };

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/waiting_rooms/${waitingRoomId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
