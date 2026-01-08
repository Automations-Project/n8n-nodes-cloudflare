import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function zeroTrustRiskScoringExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getUserRisk') {
		const userId = this.getNodeParameter('userId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/zt_risk_scoring/${userId}`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'resetUserRisk') {
		const userId = this.getNodeParameter('userId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/zt_risk_scoring/${userId}/reset`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getBehaviors') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/zt_risk_scoring/behaviors`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateBehaviors') {
		const behaviorsConfig = JSON.parse(this.getNodeParameter('behaviorsConfig', index) as string);
		const response = await cloudflareApiRequest.call(this, 'PUT', `/accounts/${accountId}/zt_risk_scoring/behaviors`, behaviorsConfig);
		return [{ json: response as IDataObject }];
	}

	return [];
}
