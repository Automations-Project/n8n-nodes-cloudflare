import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function lockdownExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const urlsStr = this.getNodeParameter('urls', index) as string;
		const configurationsJson = this.getNodeParameter('configurationsJson', index) as string;

		const urls = urlsStr.split(',').map(s => s.trim()).filter(s => s);
		const configurations = JSON.parse(configurationsJson);

		const body = { urls, configurations };

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/firewall/lockdowns`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const lockdownId = this.getNodeParameter('lockdownId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/firewall/lockdowns/${lockdownId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const lockdownId = this.getNodeParameter('lockdownId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/firewall/lockdowns/${lockdownId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/firewall/lockdowns`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/firewall/lockdowns`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'update') {
		const lockdownId = this.getNodeParameter('lockdownId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.urls) {
			body.urls = (updateFields.urls as string).split(',').map(s => s.trim()).filter(s => s);
		}
		if (updateFields.configurations) {
			body.configurations = JSON.parse(updateFields.configurations as string);
		}
		if (updateFields.description !== undefined) body.description = updateFields.description;
		if (updateFields.paused !== undefined) body.paused = updateFields.paused;

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/firewall/lockdowns/${lockdownId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

export async function uaRuleExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const mode = this.getNodeParameter('mode', index) as string;
		const userAgent = this.getNodeParameter('userAgent', index) as string;
		const createOptions = this.getNodeParameter('createOptions', index) as IDataObject;

		const body: IDataObject = {
			mode,
			configuration: {
				target: 'ua',
				value: userAgent,
			},
			...createOptions,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/firewall/ua_rules`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const uaRuleId = this.getNodeParameter('uaRuleId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/firewall/ua_rules/${uaRuleId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const uaRuleId = this.getNodeParameter('uaRuleId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/firewall/ua_rules/${uaRuleId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/firewall/ua_rules`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/firewall/ua_rules`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'update') {
		const uaRuleId = this.getNodeParameter('uaRuleId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.mode) body.mode = updateFields.mode;
		if (updateFields.description !== undefined) body.description = updateFields.description;
		if (updateFields.paused !== undefined) body.paused = updateFields.paused;
		if (updateFields.ua) {
			body.configuration = { target: 'ua', value: updateFields.ua };
		}

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/firewall/ua_rules/${uaRuleId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
