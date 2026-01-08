import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function accessRuleExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const mode = this.getNodeParameter('mode', index) as string;
		const target = this.getNodeParameter('target', index) as string;
		const value = this.getNodeParameter('value', index) as string;
		const notes = this.getNodeParameter('notes', index) as string;

		const body = {
			mode,
			configuration: {
				target,
				value,
			},
			notes,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/firewall/access_rules/rules`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const ruleId = this.getNodeParameter('ruleId', index) as string;
		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/firewall/access_rules/rules/${ruleId}`,
		);
		return [{ json: { success: true, ruleId } }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/firewall/access_rules/rules`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/firewall/access_rules/rules`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'get') {
		const ruleId = this.getNodeParameter('ruleId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/firewall/access_rules/rules/${ruleId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'update') {
		const ruleId = this.getNodeParameter('ruleId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as {
			mode?: string;
			notes?: string;
		};

		const body: IDataObject = {};

		if (updateFields.mode) {
			body.mode = updateFields.mode;
		}
		if (updateFields.notes) {
			body.notes = updateFields.notes;
		}

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/firewall/access_rules/rules/${ruleId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}

