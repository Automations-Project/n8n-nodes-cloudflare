import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function subnetsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/zerotrust/subnets`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'create') {
		const address = this.getNodeParameter('address', index) as string;
		const comment = this.getNodeParameter('comment', index, '') as string;
		const body: IDataObject = { address };
		if (comment) body.comment = comment;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/zerotrust/subnets`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const subnetId = this.getNodeParameter('subnetId', index) as string;
		const comment = this.getNodeParameter('comment', index, '') as string;
		const body: IDataObject = {};
		if (comment) body.comment = comment;
		const response = await cloudflareApiRequest.call(this, 'PATCH', `/accounts/${accountId}/zerotrust/subnets/${subnetId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const subnetId = this.getNodeParameter('subnetId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/zerotrust/subnets/${subnetId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
