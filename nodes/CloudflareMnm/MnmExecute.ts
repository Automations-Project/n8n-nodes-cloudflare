import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function mnmExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getConfig') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/mnm/config`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateConfig') {
		const response = await cloudflareApiRequest.call(this, 'PATCH', `/accounts/${accountId}/mnm/config`, {});
		return [{ json: response as IDataObject }];
	}

	if (operation === 'listRules') {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/mnm/rules`);
		return this.helpers.returnJsonArray(response as IDataObject[]);
	}

	if (operation === 'createRule') {
		const ruleName = this.getNodeParameter('ruleName', index) as string;
		const volumeThreshold = this.getNodeParameter('volumeThreshold', index) as number;
		const body = { name: ruleName, volume_threshold: volumeThreshold };
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/mnm/rules`, body);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteRule') {
		const ruleId = this.getNodeParameter('ruleId', index) as string;
		await cloudflareApiRequest.call(this, 'DELETE', `/accounts/${accountId}/mnm/rules/${ruleId}`);
		return [{ json: { success: true } }];
	}

	return [];
}
