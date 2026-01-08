import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function intelExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	// IP Resource
	if (resource === 'ip') {
		if (operation === 'get') {
			const ip = this.getNodeParameter('ip', index) as string;
			// Detect if IPv4 or IPv6
			const isIPv6 = ip.includes(':');
			const qs = isIPv6 ? { ipv6: ip } : { ipv4: ip };

			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/intel/ip`,
				{},
				qs,
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}

		if (operation === 'getList') {
			const ipListId = this.getNodeParameter('ipListId', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/intel/ip-list/${ipListId}`,
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}
	}

	// Domain Resource
	if (resource === 'domain') {
		if (operation === 'get') {
			const domain = this.getNodeParameter('domain', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/intel/domain`,
				{},
				{ domain },
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}

		if (operation === 'getBulk') {
			const domainsStr = this.getNodeParameter('domains', index) as string;
			const domains = domainsStr.split(',').map((d) => d.trim());

			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/intel/domain/bulk`,
				{},
				{ domain: domains },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}

		if (operation === 'getHistory') {
			const domain = this.getNodeParameter('domain', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/intel/domain-history`,
				{},
				{ domain },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	// ASN Resource
	if (resource === 'asn') {
		const asn = this.getNodeParameter('asn', index) as number;

		if (operation === 'get') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/intel/asn/${asn}`,
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}

		if (operation === 'getSubnets') {
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/intel/asn/${asn}/subnets`,
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}
	}

	// WHOIS Resource
	if (resource === 'whois') {
		if (operation === 'get') {
			const domain = this.getNodeParameter('whoisDomain', index) as string;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/intel/whois`,
				{},
				{ domain },
			);
			return this.helpers.returnJsonArray(response as IDataObject);
		}
	}

	return [];
}
