import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function dnssecExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'delete') {
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/dnssec`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/dnssec`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const status = this.getNodeParameter('status', index) as string;
		const body = { status };

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/dnssec`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

export async function dnsSettingsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	if (operation === 'getZone') {
		const zoneId = this.getNodeParameter('zoneId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/dns_settings`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getAccount') {
		const accountId = this.getNodeParameter('accountId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/dns_settings`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateZone') {
		const zoneId = this.getNodeParameter('zoneId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.foundation_dns !== undefined) body.foundation_dns = updateFields.foundation_dns;
		if (updateFields.multi_provider !== undefined) body.multi_provider = updateFields.multi_provider;
		if (updateFields.nameservers) body.nameservers = JSON.parse(updateFields.nameservers as string);
		if (updateFields.secondary_overrides !== undefined) body.secondary_overrides = updateFields.secondary_overrides;
		if (updateFields.zone_mode) body.zone_mode = updateFields.zone_mode;

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/dns_settings`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateAccount') {
		const accountId = this.getNodeParameter('accountId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.foundation_dns !== undefined) body.foundation_dns = updateFields.foundation_dns;
		if (updateFields.zone_mode) body.zone_mode = updateFields.zone_mode;

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/accounts/${accountId}/dns_settings`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
