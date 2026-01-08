import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function alertingExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	// Policy Resource
	if (resource === 'policy') {
		if (operation === 'create') {
			const name = this.getNodeParameter('name', index) as string;
			const alertType = this.getNodeParameter('alertType', index) as string;
			const enabled = this.getNodeParameter('enabled', index) as boolean;
			const mechanismsJson = this.getNodeParameter('mechanisms', index) as string;

			const mechanisms = JSON.parse(mechanismsJson);

			const body = {
				name,
				alert_type: alertType,
				enabled,
				mechanisms,
			};

			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				`/accounts/${accountId}/alerting/v3/policies`,
				body,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'delete') {
			const policyId = this.getNodeParameter('policyId', index) as string;
			await cloudflareApiRequest.call(
				this,
				'DELETE',
				`/accounts/${accountId}/alerting/v3/policies/${policyId}`,
			);
			return [{ json: { success: true, policyId } }];
		}

		if (operation === 'get') {
			const policyId = this.getNodeParameter('policyId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/alerting/v3/policies/${policyId}`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					`/accounts/${accountId}/alerting/v3/policies`,
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					`/accounts/${accountId}/alerting/v3/policies`,
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}

		if (operation === 'update') {
			const policyId = this.getNodeParameter('policyId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			const body: IDataObject = { ...updateFields };

			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/accounts/${accountId}/alerting/v3/policies/${policyId}`,
				body,
			);
			return [{ json: response as IDataObject }];
		}
	}

	// Destination Resource
	if (resource === 'destination') {
		if (operation === 'getMany') {
			const destinationType = this.getNodeParameter('destinationType', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					`/accounts/${accountId}/alerting/v3/destinations/${destinationType}`,
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					`/accounts/${accountId}/alerting/v3/destinations/${destinationType}`,
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}
	}

	return [];
}
