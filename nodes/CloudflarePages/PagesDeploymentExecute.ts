import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function pagesDeploymentExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;
	const projectName = this.getNodeParameter('projectName', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const filters = this.getNodeParameter('deploymentFilters', itemIndex) as {
			env?: string;
		};

		const qs: IDataObject = {};

		if (filters.env) {
			qs.env = filters.env;
		}

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/pages/projects/${projectName}/deployments`,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			qs.per_page = limit;
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/pages/projects/${projectName}/deployments`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const deploymentId = this.getNodeParameter('deploymentId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`,
		);
	}

	if (operation === 'delete') {
		const deploymentId = this.getNodeParameter('deploymentId', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`,
		);

		responseData = { success: true, deleted: deploymentId };
	}

	if (operation === 'retry') {
		const deploymentId = this.getNodeParameter('deploymentId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}/retry`,
		);
	}

	if (operation === 'rollback') {
		const deploymentId = this.getNodeParameter('deploymentId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}/rollback`,
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
