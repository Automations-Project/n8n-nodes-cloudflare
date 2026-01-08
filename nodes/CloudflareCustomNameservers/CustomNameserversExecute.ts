import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function accountNsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'create') {
		const nsName = this.getNodeParameter('nsName', index) as string;
		const nsSet = this.getNodeParameter('nsSet', index) as number;

		const body = {
			ns_name: nsName,
			ns_set: nsSet,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/custom_ns`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const customNsId = this.getNodeParameter('customNsId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/custom_ns/${customNsId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const customNsId = this.getNodeParameter('customNsId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/custom_ns/${customNsId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(
			this,
			'GET',
			`/accounts/${accountId}/custom_ns`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	return [];
}

export async function zoneNsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/custom_ns`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const enabled = this.getNodeParameter('enabled', index) as boolean;
		const nsSet = this.getNodeParameter('nsSet', index) as number;

		const body = {
			enabled,
			ns_set: nsSet,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/custom_ns`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
