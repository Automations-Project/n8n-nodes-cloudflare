import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function rateLimitsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const matchUrl = this.getNodeParameter('matchUrl', index) as string;
		const threshold = this.getNodeParameter('threshold', index) as number;
		const period = this.getNodeParameter('period', index) as number;
		const actionMode = this.getNodeParameter('actionMode', index) as string;

		const body: IDataObject = {
			match: {
				request: {
					url_pattern: matchUrl,
				},
			},
			threshold,
			period,
			action: {
				mode: actionMode,
			},
		};

		// Add timeout for ban action
		if (actionMode === 'ban') {
			const actionTimeout = this.getNodeParameter('actionTimeout', index) as number;
			(body.action as IDataObject).timeout = actionTimeout;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/rate_limits`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const rateLimitId = this.getNodeParameter('rateLimitId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/rate_limits/${rateLimitId}`,
		);
		return [{ json: { success: true, rateLimitId } }];
	}

	if (operation === 'get') {
		const rateLimitId = this.getNodeParameter('rateLimitId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/rate_limits/${rateLimitId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/rate_limits`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/rate_limits`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'update') {
		const rateLimitId = this.getNodeParameter('rateLimitId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = {};

		if (updateFields.threshold) {
			body.threshold = updateFields.threshold;
		}

		if (updateFields.period) {
			body.period = updateFields.period;
		}

		if (updateFields.disabled !== undefined) {
			body.disabled = updateFields.disabled;
		}

		if (updateFields.action_mode) {
			body.action = { mode: updateFields.action_mode };
		}

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/rate_limits/${rateLimitId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
