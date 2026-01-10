import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function radarExecute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const dateRange = this.getNodeParameter('dateRange', index, '7d') as string;

	const qs: IDataObject = { dateRange };

	// HTTP Resource
	if (resource === 'http') {
		if (operation === 'getSummary') {
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/http/summary/bot_class', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getTimeseries') {
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/http/timeseries', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getTopLocations') {
			const limit = this.getNodeParameter('limit', index, 10) as number;
			qs.limit = limit;
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/http/top/locations', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getTopAsns') {
			const limit = this.getNodeParameter('limit', index, 10) as number;
			qs.limit = limit;
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/http/top/ases', {}, qs);
			return [{ json: response as IDataObject }];
		}
	}

	// BGP Resource
	if (resource === 'bgp') {
		if (operation === 'getRoutes') {
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/bgp/routes/stats', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getTimeseries') {
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/bgp/timeseries', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getTopAsns') {
			const limit = this.getNodeParameter('limit', index, 10) as number;
			qs.limit = limit;
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/bgp/top/ases', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getTopPrefixes') {
			const limit = this.getNodeParameter('limit', index, 10) as number;
			qs.limit = limit;
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/bgp/top', {}, qs);
			return [{ json: response as IDataObject }];
		}
	}

	// DNS Resource
	if (resource === 'dns') {
		if (operation === 'getTopLocations') {
			const limit = this.getNodeParameter('limit', index, 10) as number;
			qs.limit = limit;
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/dns/top/locations', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getTopDomains') {
			const limit = this.getNodeParameter('limit', index, 10) as number;
			qs.limit = limit;
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/ranking/top', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getTimeseries') {
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/dns/timeseries', {}, qs);
			return [{ json: response as IDataObject }];
		}
	}

	// Attacks Resource
	if (resource === 'attacks') {
		if (operation === 'getLayer3Timeseries') {
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/attacks/layer3/timeseries', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getLayer7Timeseries') {
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/attacks/layer7/timeseries', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getTopVectors') {
			const limit = this.getNodeParameter('limit', index, 10) as number;
			qs.limit = limit;
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/attacks/layer3/top', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getTopIndustries') {
			const limit = this.getNodeParameter('limit', index, 10) as number;
			qs.limit = limit;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				'/radar/attacks/layer7',
				{},
				{ ...qs, dimension: 'industry', limit },
			);
			return [{ json: response as IDataObject }];
		}
	}

	// Quality Resource
	if (resource === 'quality') {
		if (operation === 'getSpeedSummary') {
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/quality/speed/summary', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getIqiSummary') {
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/quality/iqi/summary', {}, qs);
			return [{ json: response as IDataObject }];
		}
	}

	// Ranking Resource
	if (resource === 'ranking') {
		if (operation === 'getTopDomains') {
			const limit = this.getNodeParameter('limit', index, 10) as number;
			qs.limit = limit;
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/ranking/top', {}, qs);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getDomainDetails') {
			const domain = this.getNodeParameter('domain', index) as string;
			const response = await cloudflareApiRequest.call(this, 'GET', `/radar/ranking/domain/${domain}`, {}, qs);
			return [{ json: response as IDataObject }];
		}
	}

	// Entities Resource
	if (resource === 'entities') {
		if (operation === 'getAsnDetails') {
			const asn = this.getNodeParameter('asn', index) as string;
			const response = await cloudflareApiRequest.call(this, 'GET', `/radar/entities/asns/${asn}`, {});
			return [{ json: response as IDataObject }];
		}
		if (operation === 'getLocationDetails') {
			const location = this.getNodeParameter('location', index) as string;
			const response = await cloudflareApiRequest.call(this, 'GET', `/radar/entities/locations/${location}`, {});
			return [{ json: response as IDataObject }];
		}
		if (operation === 'listAsns') {
			const limit = this.getNodeParameter('limit', index, 10) as number;
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/entities/asns', {}, { limit });
			return [{ json: response as IDataObject }];
		}
		if (operation === 'listLocations') {
			const limit = this.getNodeParameter('limit', index, 10) as number;
			const response = await cloudflareApiRequest.call(this, 'GET', '/radar/entities/locations', {}, { limit });
			return [{ json: response as IDataObject }];
		}
	}

	return [];
}
