import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function logpushExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const scope = this.getNodeParameter('scope', index) as string;

	let baseUrl = '';
	if (scope === 'zone') {
		const zoneId = this.getNodeParameter('zoneId', index) as string;
		baseUrl = `/zones/${zoneId}/logpush/jobs`;
	} else {
		const accountId = this.getNodeParameter('accountId', index) as string;
		baseUrl = `/accounts/${accountId}/logpush/jobs`;
	}

	// Job Resource
	if (resource === 'job') {
		if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;
		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', baseUrl);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(this, 'GET', baseUrl, {}, { per_page: limit });
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	if (operation === 'create') {
		const dataset = this.getNodeParameter('dataset', index) as string;
		const destination_conf = this.getNodeParameter('destination_conf', index) as string;
		const name = this.getNodeParameter('name', index) as string;
		const logpull_options = this.getNodeParameter('logpull_options', index) as string;
		const enabled = this.getNodeParameter('enabled', index) as boolean;

		const body: IDataObject = {
			dataset,
			destination_conf,
			enabled,
		};
		if (name) body.name = name;
		if (logpull_options) body.logpull_options = logpull_options;

		const response = await cloudflareApiRequest.call(this, 'POST', baseUrl, body);
		return this.helpers.returnJsonArray(response as IDataObject);
	}

	if (operation === 'validate') {
		const dataset = this.getNodeParameter('dataset', index) as string;
		const destination_conf = this.getNodeParameter('destination_conf', index) as string;

		const body = {
			dataset,
			destination_conf,
		};

		// Validate endpoint is usually /validate at the end of base url?
		// Docs: POST zones/:zone_id/logpush/validate/destination
		let validateUrl = '';
		if (scope === 'zone') {
			const zoneId = this.getNodeParameter('zoneId', index) as string;
			validateUrl = `/zones/${zoneId}/logpush/validate/destination`;
		} else {
			const accountId = this.getNodeParameter('accountId', index) as string;
			validateUrl = `/accounts/${accountId}/logpush/validate/destination`;
		}

		const response = await cloudflareApiRequest.call(this, 'POST', validateUrl, body);
		return this.helpers.returnJsonArray(response as IDataObject);
	}

	if (operation === 'update') {
		const jobId = this.getNodeParameter('jobId', index) as string;
		const destination_conf = this.getNodeParameter('destination_conf', index) as string;
		const name = this.getNodeParameter('name', index) as string;
		const logpull_options = this.getNodeParameter('logpull_options', index) as string;
		const enabled = this.getNodeParameter('enabled', index) as boolean;

		const body: IDataObject = {
			destination_conf,
			enabled,
		};
		if (name) body.name = name;
		if (logpull_options) body.logpull_options = logpull_options;

		const response = await cloudflareApiRequest.call(this, 'PUT', `${baseUrl}/${jobId}`, body);
		return this.helpers.returnJsonArray(response as IDataObject);
	}

	if (operation === 'delete') {
		const jobId = this.getNodeParameter('jobId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'DELETE', `${baseUrl}/${jobId}`);
		return this.helpers.returnJsonArray(response as IDataObject);
	}

	if (operation === 'get') {
		const jobId = this.getNodeParameter('jobId', index) as string;
		const response = await cloudflareApiRequest.call(this, 'GET', `${baseUrl}/${jobId}`);
		return this.helpers.returnJsonArray(response as IDataObject);
	}

	} // end job resource

	// Dataset Resource
	if (resource === 'dataset') {
		const scope = this.getNodeParameter('scope', index) as string;
		const datasetId = this.getNodeParameter('datasetId', index) as string;
		let basePath = '';
		if (scope === 'zone') {
			const zoneId = this.getNodeParameter('zoneId', index) as string;
			basePath = `/zones/${zoneId}/logpush/datasets/${datasetId}`;
		} else {
			const accountId = this.getNodeParameter('accountId', index) as string;
			basePath = `/accounts/${accountId}/logpush/datasets/${datasetId}`;
		}

		if (operation === 'getFields') {
			const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/fields`);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getJobs') {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', `${basePath}/jobs`);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		}
	}

	// Edge Resource (zone-only)
	if (resource === 'edge') {
		const zoneId = this.getNodeParameter('zoneId', index) as string;
		if (operation === 'createEdge') {
			const config = JSON.parse(this.getNodeParameter('edgeJobConfig', index) as string);
			const response = await cloudflareApiRequest.call(this, 'POST', `/zones/${zoneId}/logpush/edge/jobs`, config);
			return [{ json: response as IDataObject }];
		}
	}

	return [];
}
