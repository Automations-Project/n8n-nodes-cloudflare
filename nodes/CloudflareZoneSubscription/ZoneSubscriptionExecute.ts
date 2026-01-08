import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function zoneSubscriptionExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/subscription`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'create') {
		const ratePlan = this.getNodeParameter('ratePlan', index, '') as string;
		const body: IDataObject = {};
		if (ratePlan) body.rate_plan = { id: ratePlan };
		const response = await cloudflareApiRequest.call(this, 'POST', `/zones/${zoneId}/subscription`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const ratePlan = this.getNodeParameter('ratePlan', index, '') as string;
		const body: IDataObject = {};
		if (ratePlan) body.rate_plan = { id: ratePlan };
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/subscription`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
