import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

// Batch Execute Handler
export async function dnsBatchExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;
	const batchRecords = JSON.parse(this.getNodeParameter('batchRecords', index) as string);

	if (operation === 'create') {
		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/dns_records/batch`,
			{ posts: batchRecords },
		);
		return [{ json: response as IDataObject }];
	}
	if (operation === 'delete') {
		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/dns_records/batch`,
			{ deletes: batchRecords },
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

// Scan Execute Handler
export async function dnsScanExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'scan') {
		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/dns_records/scan`,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
