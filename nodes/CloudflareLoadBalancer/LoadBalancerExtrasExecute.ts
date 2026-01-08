import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function lbRegionExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'get') {
		const regionCode = this.getNodeParameter('regionCode', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/load_balancers/regions/${regionCode}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(
			this,
			'GET',
			`/accounts/${accountId}/load_balancers/regions`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	return [];
}

export async function poolHealthExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;
	const poolId = this.getNodeParameter('poolId', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/load_balancers/pools/${poolId}/health`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'preview') {
		const monitorId = this.getNodeParameter('monitorId', index) as string;
		const body = { expected_codes: '2xx' };

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/load_balancers/pools/${poolId}/preview`,
			body,
			{ monitor_id: monitorId },
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
