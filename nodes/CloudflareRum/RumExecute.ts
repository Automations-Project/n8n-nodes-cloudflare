import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function rumExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'listSites') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/rum/site_info/list`);
		const result = Array.isArray(response) ? response : (response as IDataObject).result || [];
		return this.helpers.returnJsonArray(result as IDataObject[]);
	}

	if (operation === 'getSite') {
		const siteId = this.getNodeParameter('siteId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/rum/site_info/${siteId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createSite') {
		const host = this.getNodeParameter('host', index) as string;
		const zoneTag = this.getNodeParameter('zoneTag', index, '') as string;
		const autoInstall = this.getNodeParameter('autoInstall', index) as boolean;
		const body: IDataObject = { host, auto_install: autoInstall };
		if (zoneTag) body.zone_tag = zoneTag;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/rum/site_info`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateSite') {
		const siteId = this.getNodeParameter('siteId', index) as string;
		const zoneTag = this.getNodeParameter('zoneTag', index, '') as string;
		const autoInstall = this.getNodeParameter('autoInstall', index) as boolean;
		const body: IDataObject = { auto_install: autoInstall };
		if (zoneTag) body.zone_tag = zoneTag;
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/rum/site_info/${siteId}`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteSite') {
		const siteId = this.getNodeParameter('siteId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/rum/site_info/${siteId}`);
		return [{ json: { success: true } }];
	}

	if (operation === 'listRules') {
		const siteId = this.getNodeParameter('siteId', index) as string;
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/rum/v2/${siteId}/rules`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	return [];
}
