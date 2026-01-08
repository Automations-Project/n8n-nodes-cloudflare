import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function ratePlansExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/zones/${zoneId}/available_rate_plans`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	return [];
}
