import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function accessApplicationExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'delete') {
		const applicationId = this.getNodeParameter('applicationId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/access/apps/${applicationId}`,
		);
		return [{ json: { success: true, applicationId } }];
	}

	if (operation === 'get') {
		const applicationId = this.getNodeParameter('applicationId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/access/apps/${applicationId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/access/apps`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/access/apps`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			// Wait, GenericFunctions doesn't automatically unwrap 'result' for simple requests unless specific function used?
			// cloudflareApiRequest returns body.result if available?
			// Let's check GenericFunctions usage in other nodes.
		}
	}

	return [];
}
