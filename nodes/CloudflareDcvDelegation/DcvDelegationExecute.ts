import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function dcvDelegationExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getUuid') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/dcv_delegation/uuid`);
		return [{ json: response as IDataObject }];
	}

	return [];
}
