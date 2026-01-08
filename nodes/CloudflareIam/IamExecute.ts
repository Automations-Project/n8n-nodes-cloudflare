import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function iamExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'listPermissionGroups') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/iam/permission_groups`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getPermissionGroup') {
		const permissionGroupId = this.getNodeParameter('permissionGroupId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/iam/permission_groups/${permissionGroupId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'listResourceGroups') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/iam/resource_groups`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'getResourceGroup') {
		const resourceGroupId = this.getNodeParameter('resourceGroupId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/iam/resource_groups/${resourceGroupId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'createResourceGroup') {
		const name = this.getNodeParameter('name', index) as string;
		const scope = JSON.parse(this.getNodeParameter('scope', index) as string);
		const body = { scope: { key: name, objects: [scope] } };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/iam/resource_groups`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteResourceGroup') {
		const resourceGroupId = this.getNodeParameter('resourceGroupId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/iam/resource_groups/${resourceGroupId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
