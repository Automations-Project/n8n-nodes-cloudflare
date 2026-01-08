import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function workersCronExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const scriptName = this.getNodeParameter('scriptName', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/workers/scripts/${scriptName}/schedules`,
		);
	}

	if (operation === 'update') {
		const cronExpressions = this.getNodeParameter('cronExpressions', itemIndex) as string;

		// Parse comma-separated cron expressions
		const schedules = cronExpressions.split(',').map((cron) => ({
			cron: cron.trim(),
		}));

		const body: IDataObject = {
			schedules,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/accounts/${accountId}/workers/scripts/${scriptName}/schedules`,
			body,
		);
	}

	// Normalize response
	const result: IDataObject[] = Array.isArray(responseData)
		? responseData
		: responseData
			? [responseData]
			: [{ success: true }];

	return result.map((item) => ({
		json: item,
		pairedItem: { item: itemIndex },
	}));
}
