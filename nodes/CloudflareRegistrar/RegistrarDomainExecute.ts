import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function registrarDomainExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'get') {
		const domainName = this.getNodeParameter('domainName', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/registrar/domains/${domainName}`,
		);
		return this.helpers.returnJsonArray(response as IDataObject);
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/registrar/domains`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/registrar/domains`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'update') {
		const domainName = this.getNodeParameter('domainName', index) as string;
		const autoRenew = this.getNodeParameter('autoRenew', index) as boolean;
		const locked = this.getNodeParameter('locked', index) as boolean;
		const privacy = this.getNodeParameter('privacy', index) as boolean;

		const body = {
			auto_renew: autoRenew,
			locked,
			privacy,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/accounts/${accountId}/registrar/domains/${domainName}`,
			body,
		);

		return this.helpers.returnJsonArray(response as IDataObject);
	}

	return [];
}
