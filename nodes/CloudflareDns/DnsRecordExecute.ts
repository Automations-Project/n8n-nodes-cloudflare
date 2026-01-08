import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function dnsRecordExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const zoneId = this.getNodeParameter('zoneId', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'create') {
		const type = this.getNodeParameter('type', itemIndex) as string;
		const name = this.getNodeParameter('name', itemIndex) as string;
		const content = this.getNodeParameter('content', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as {
			ttl?: number;
			proxied?: boolean;
			priority?: number;
			comment?: string;
		};

		const body: IDataObject = {
			type,
			name,
			content,
		};

		if (additionalFields.ttl !== undefined) {
			body.ttl = additionalFields.ttl;
		}
		if (additionalFields.proxied !== undefined) {
			body.proxied = additionalFields.proxied;
		}
		if (additionalFields.priority !== undefined) {
			body.priority = additionalFields.priority;
		}
		if (additionalFields.comment !== undefined) {
			body.comment = additionalFields.comment;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/zones/${zoneId}/dns_records`,
			body,
		);
	}

	if (operation === 'delete') {
		const recordId = this.getNodeParameter('recordId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/dns_records/${recordId}`,
		);
	}

	if (operation === 'get') {
		const recordId = this.getNodeParameter('recordId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/dns_records/${recordId}`,
		);
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const filters = this.getNodeParameter('filters', itemIndex) as {
			name?: string;
			type?: string;
			content?: string;
			proxied?: boolean;
		};

		const qs: IDataObject = {};

		if (filters.name) {
			qs.name = filters.name;
		}
		if (filters.type) {
			qs.type = filters.type;
		}
		if (filters.content) {
			qs.content = filters.content;
		}
		if (filters.proxied !== undefined) {
			qs.proxied = filters.proxied;
		}

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/zones/${zoneId}/dns_records`,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			qs.per_page = limit;
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/zones/${zoneId}/dns_records`,
				{},
				qs,
			);
		}
	}

	if (operation === 'update') {
		const recordId = this.getNodeParameter('recordId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex) as {
			type?: string;
			name?: string;
			content?: string;
			ttl?: number;
			proxied?: boolean;
			comment?: string;
		};

		const body: IDataObject = {};

		if (updateFields.type !== undefined) {
			body.type = updateFields.type;
		}
		if (updateFields.name !== undefined) {
			body.name = updateFields.name;
		}
		if (updateFields.content !== undefined) {
			body.content = updateFields.content;
		}
		if (updateFields.ttl !== undefined) {
			body.ttl = updateFields.ttl;
		}
		if (updateFields.proxied !== undefined) {
			body.proxied = updateFields.proxied;
		}
		if (updateFields.comment !== undefined) {
			body.comment = updateFields.comment;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/zones/${zoneId}/dns_records/${recordId}`,
			body,
		);
	}

	if (operation === 'export') {
		// Export DNS records in BIND format
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/dns_records/export`,
		);
		// Response is raw BIND file content
		responseData = { bindContent: response };
	}

	if (operation === 'import') {
		const bindContent = this.getNodeParameter('bindContent', itemIndex) as string;

		// Import requires form-data with file upload
		const options = {
			method: 'POST' as const,
			url: `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/import`,
			formData: {
				file: {
					value: Buffer.from(bindContent),
					options: {
						filename: 'zone.txt',
						contentType: 'text/plain',
					},
				},
			},
			json: true,
		};

		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'cloudflareApi',
			options,
		);

		responseData = response.result;
	}

	// Normalize response - ensure we always have an array
	const result: IDataObject[] = Array.isArray(responseData)
		? responseData
		: responseData
			? [responseData]
			: [{ success: true }];

	return result.map((item) => ({
		json: item,
		pairedItem: { item: itemIndex },
	}));
}

