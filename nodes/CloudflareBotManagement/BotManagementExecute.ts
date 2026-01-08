import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function botManagementExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'get') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/bot_management`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = { ...updateFields };

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/bot_management`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
