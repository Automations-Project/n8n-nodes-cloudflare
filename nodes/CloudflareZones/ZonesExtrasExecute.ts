import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function activationCheckExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'trigger') {
		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/activation_check`,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

export async function zoneHoldExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const includeSubdomains = this.getNodeParameter('includeSubdomains', index) as boolean;

		const qs: IDataObject = {};
		if (includeSubdomains) {
			qs.include_subdomains = true;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/hold`,
			{},
			qs,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const holdAfter = this.getNodeParameter('holdAfter', index) as string;

		const qs: IDataObject = {};
		if (holdAfter) {
			qs.hold_after = holdAfter;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/hold`,
			{},
			qs,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/hold`,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

export async function zonePlanExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'get') {
		const planId = this.getNodeParameter('planId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/available_plans/${planId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/available_plans`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	return [];
}
