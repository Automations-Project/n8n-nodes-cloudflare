import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function turnstileExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/challenges/widgets`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/challenges/widgets`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const mode = this.getNodeParameter('mode', index) as string;
		const domainsString = this.getNodeParameter('domains', index) as string;
		const domains = domainsString
			.split(',')
			.map((d) => d.trim())
			.filter((d) => d);
		const botFightMode = this.getNodeParameter('bot_fight_mode', index) as boolean;

		const body = {
			name,
			mode,
			domains,
			bot_fight_mode: botFightMode,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/challenges/widgets`,
			body,
		);
		return this.helpers.returnJsonArray(response as IDataObject);
	}

	if (operation === 'update') {
		const sitekey = this.getNodeParameter('sitekey', index) as string;
		const name = this.getNodeParameter('name', index) as string;
		const mode = this.getNodeParameter('mode', index) as string;
		const domainsString = this.getNodeParameter('domains', index) as string;
		const domains = domainsString
			.split(',')
			.map((d) => d.trim())
			.filter((d) => d);
		const botFightMode = this.getNodeParameter('bot_fight_mode', index) as boolean;

		const body = {
			name,
			mode,
			domains,
			bot_fight_mode: botFightMode,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/accounts/${accountId}/challenges/widgets/${sitekey}`,
			body,
		);
		return this.helpers.returnJsonArray(response as IDataObject);
	}

	if (operation === 'delete') {
		const sitekey = this.getNodeParameter('sitekey', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/challenges/widgets/${sitekey}`,
		);
		return this.helpers.returnJsonArray(response as IDataObject);
	}

	if (operation === 'get') {
		const sitekey = this.getNodeParameter('sitekey', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/challenges/widgets/${sitekey}`,
		);
		return this.helpers.returnJsonArray(response as IDataObject);
	}

	if (operation === 'rotateSecret') {
		const sitekey = this.getNodeParameter('sitekey', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/challenges/widgets/${sitekey}/rotate_secret`,
		);
		return this.helpers.returnJsonArray(response as IDataObject);
	}

	return [];
}
