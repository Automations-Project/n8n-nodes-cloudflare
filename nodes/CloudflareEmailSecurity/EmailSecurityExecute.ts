import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function emailSecurityExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'getSettings') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/email-security/settings`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getTrustedDomains') {
		const response = await cloudflareApiRequestAllItems.call(
			this,
			'GET',
			`/accounts/${accountId}/email-security/settings/trusted_domains`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'createTrustedDomain') {
		const domain = this.getNodeParameter('domain', index) as string;

		const body = {
			is_recent: false,
			is_regex: false,
			is_similarity: false,
			pattern: domain,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/email-security/settings/trusted_domains`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteTrustedDomain') {
		const domain = this.getNodeParameter('domain', index) as string;

		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/email-security/settings/trusted_domains/${encodeURIComponent(domain)}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getImpersonationRegistry') {
		const response = await cloudflareApiRequestAllItems.call(
			this,
			'GET',
			`/accounts/${accountId}/email-security/settings/impersonation_registry`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'createImpersonationEntry') {
		const email = this.getNodeParameter('email', index) as string;
		const name = this.getNodeParameter('name', index) as string;

		const body = {
			email,
			name,
			is_email_regex: false,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/email-security/settings/impersonation_registry`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'deleteImpersonationEntry') {
		const entryId = this.getNodeParameter('entryId', index) as string;

		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/email-security/settings/impersonation_registry/${entryId}`,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
