import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function dnsAnalyticsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;
	const dimensions = this.getNodeParameter('dimensions', index, '') as string;
	const metrics = this.getNodeParameter('metrics', index, '') as string;

	const qs: IDataObject = {};
	if (dimensions) qs.dimensions = dimensions;
	if (metrics) qs.metrics = metrics;

	if (operation === 'getReport') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/dns_analytics/report`, {}, qs);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getReportByTime') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/dns_analytics/report/bytime`, {}, qs);
		return [{ json: response as IDataObject }];
	}

	return [];
}
