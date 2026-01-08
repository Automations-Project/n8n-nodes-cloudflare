import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function auditLogsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		const filters = this.getNodeParameter('filters', index) as IDataObject;

		const qs: IDataObject = {};

		// Map nested filter keys
		if (filters['action.type']) qs['action.type'] = filters['action.type'];
		if (filters['actor.email']) qs['actor.email'] = filters['actor.email'];
		if (filters['actor.ip']) qs['actor.ip'] = filters['actor.ip'];
		if (filters['zone.name']) qs['zone.name'] = filters['zone.name'];
		if (filters.direction) qs.direction = filters.direction;
		if (filters.hide_user_logs) qs.hide_user_logs = filters.hide_user_logs;
		if (filters.since) qs.since = filters.since;
		if (filters.before) qs.before = filters.before;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/audit_logs`,
				{},
				qs,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			qs.per_page = limit;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/audit_logs`,
				{},
				qs,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	return [];
}
