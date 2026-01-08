import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function dlpExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'listDatasets') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/dlp/datasets`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getDataset') {
		const datasetId = this.getNodeParameter('datasetId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/dlp/datasets/${datasetId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createDataset') {
		const name = this.getNodeParameter('name', index) as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const body: IDataObject = { name };
		if (description) body.description = description;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/dlp/datasets`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteDataset') {
		const datasetId = this.getNodeParameter('datasetId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/dlp/datasets/${datasetId}`);
		return [{ json: { success: true } }];
	}

	if (operation === 'listProfiles') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/dlp/profiles`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getProfile') {
		const profileId = this.getNodeParameter('profileId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/dlp/profiles/${profileId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createProfile') {
		const name = this.getNodeParameter('name', index) as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const body: IDataObject = { name, entries: [] };
		if (description) body.description = description;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/dlp/profiles/custom`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteProfile') {
		const profileId = this.getNodeParameter('profileId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/dlp/profiles/custom/${profileId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
