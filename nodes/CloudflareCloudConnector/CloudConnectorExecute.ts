import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function cloudConnectorExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getRules') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/cloud_connector/rules`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateRules') {
		const rules = JSON.parse(this.getNodeParameter('rules', index) as string);
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/cloud_connector/rules`, rules);
		return [{ json: response as IDataObject }];
	}

	return [];
}
