import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function abuseReportsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'submit') {
		const reportType = this.getNodeParameter('reportType', index) as string;
		const url = this.getNodeParameter('url', index) as string;
		const description = this.getNodeParameter('description', index, '') as string;
		const body: IDataObject = { url };
		if (description) body.description = description;
		const response = await cloudflareApiRequest.call(this, 'POST', `/accounts/${accountId}/abuse-reports/${reportType}`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
