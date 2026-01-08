import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function dnsFirewallExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'create') {
		const name = this.getNodeParameter('name', index) as string;
		const upstreamIpsStr = this.getNodeParameter('upstreamIps', index) as string;
		const createOptions = this.getNodeParameter('createOptions', index) as IDataObject;

		const upstream_ips = upstreamIpsStr.split(',').map(s => s.trim()).filter(s => s);

		const body: IDataObject = {
			name,
			upstream_ips,
			...createOptions,
		};

		// Parse attack_mitigation if it's a string
		if (typeof body.attack_mitigation === 'string') {
			body.attack_mitigation = JSON.parse(body.attack_mitigation as string);
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/dns_firewall`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const clusterId = this.getNodeParameter('clusterId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/dns_firewall/${clusterId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const clusterId = this.getNodeParameter('clusterId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/dns_firewall/${clusterId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/dns_firewall`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/dns_firewall`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'update') {
		const clusterId = this.getNodeParameter('clusterId', index) as string;
		const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

		const body: IDataObject = { ...updateFields };

		// Parse upstream_ips if provided
		if (body.upstream_ips && typeof body.upstream_ips === 'string') {
			body.upstream_ips = (body.upstream_ips as string).split(',').map(s => s.trim()).filter(s => s);
		}

		// Parse attack_mitigation if it's a string
		if (typeof body.attack_mitigation === 'string') {
			body.attack_mitigation = JSON.parse(body.attack_mitigation as string);
		}

		const response = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/accounts/${accountId}/dns_firewall/${clusterId}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	return [];
}
