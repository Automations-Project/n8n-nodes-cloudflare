import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function pageRulesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const urlPattern = this.getNodeParameter('urlPattern', index) as string;
		const actionsJson = this.getNodeParameter('actionsJson', index) as string;
		const createOptions = this.getNodeParameter('createOptions', index) as IDataObject;

		const actions = JSON.parse(actionsJson);

		const body: IDataObject = {
			targets: [
				{
					target: 'url',
					constraint: {
						operator: 'matches',
						value: urlPattern,
					},
				},
			],
			actions,
			...createOptions,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/pagerules`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const pageRuleId = this.getNodeParameter('pageRuleId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/pagerules/${pageRuleId}`,
		);
		return [{ json: { success: true, pageRuleId } }];
	}

	if (operation === 'get') {
		const pageRuleId = this.getNodeParameter('pageRuleId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/pagerules/${pageRuleId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/pagerules`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/pagerules`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'update') {
		const pageRuleId = this.getNodeParameter('pageRuleId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = {};

		if (updateFields.targets) {
			body.targets = [
				{
					target: 'url',
					constraint: {
						operator: 'matches',
						value: updateFields.targets,
					},
				},
			];
		}

		if (updateFields.actions) {
			body.actions = JSON.parse(updateFields.actions as string);
		}

		if (updateFields.priority) {
			body.priority = updateFields.priority;
		}

		if (updateFields.status) {
			body.status = updateFields.status;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/pagerules/${pageRuleId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
