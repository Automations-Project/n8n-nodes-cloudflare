import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function userExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;

	// ===========================================
	//         User Resource
	// ===========================================
	if (resource === 'user') {
		if (operation === 'get') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				'/user',
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'update') {
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.first_name) body.first_name = updateFields.first_name;
			if (updateFields.last_name) body.last_name = updateFields.last_name;
			if (updateFields.telephone) body.telephone = updateFields.telephone;
			if (updateFields.country) body.country = updateFields.country;
			if (updateFields.zipcode) body.zipcode = updateFields.zipcode;

			const response = await cloudflareApiRequest.call(
				this,
				'PATCH',
				'/user',
				body,
			);
			return [{ json: response as IDataObject }];
		}
	}

	// ===========================================
	//         Token Resource
	// ===========================================
	if (resource === 'token') {
		if (operation === 'create') {
			const name = this.getNodeParameter('name', index) as string;
			const policiesJson = this.getNodeParameter('policies', index) as string;
			const createOptions = this.getNodeParameter('createOptions', index) as IDataObject;

			const policies = JSON.parse(policiesJson);

			const body: IDataObject = {
				name,
				policies,
			};

			if (createOptions.expires_on) body.expires_on = createOptions.expires_on;
			if (createOptions.not_before) body.not_before = createOptions.not_before;
			if (createOptions.condition) {
				body.condition = JSON.parse(createOptions.condition as string);
			}

			const response = await cloudflareApiRequest.call(
				this,
				'POST',
				'/user/tokens',
				body,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'delete') {
			const tokenId = this.getNodeParameter('tokenId', index) as string;
			await cloudflareApiRequest.call(
				this,
				'DELETE',
				`/user/tokens/${tokenId}`,
			);
			return [{ json: { success: true, tokenId } }];
		}

		if (operation === 'get') {
			const tokenId = this.getNodeParameter('tokenId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/user/tokens/${tokenId}`,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'getMany') {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;

			if (returnAll) {
				const response = await cloudflareApiRequestAllItems.call(
					this,
					'GET',
					'/user/tokens',
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			} else {
				const limit = this.getNodeParameter('limit', index) as number;
				const response = await cloudflareApiRequest.call(
					this,
					'GET',
					'/user/tokens',
					{},
					{ per_page: limit },
				);
				return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
			}
		}

		if (operation === 'roll') {
			const tokenId = this.getNodeParameter('tokenId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/user/tokens/${tokenId}/value`,
				{},
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'update') {
			const tokenId = this.getNodeParameter('tokenId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.name) body.name = updateFields.name;
			if (updateFields.status) body.status = updateFields.status;
			if (updateFields.policies) {
				body.policies = JSON.parse(updateFields.policies as string);
			}

			const response = await cloudflareApiRequest.call(
				this,
				'PUT',
				`/user/tokens/${tokenId}`,
				body,
			);
			return [{ json: response as IDataObject }];
		}

		if (operation === 'verify') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				'/user/tokens/verify',
			);
			return [{ json: response as IDataObject }];
		}
	}

	return [];
}
