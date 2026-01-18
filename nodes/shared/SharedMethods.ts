import { ILoadOptionsFunctions, INodePropertyOptions, IDataObject } from 'n8n-workflow';
import { cloudflareApiRequest } from './GenericFunctions';

/**
 * Get accounts for dropdown options
 */
export async function getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await cloudflareApiRequest.call(this, 'GET', '/accounts');
	const accounts = response as unknown as IDataObject[];

	if (!Array.isArray(accounts)) return [];

	return accounts.map((account) => ({
		name: account.name as string,
		value: account.id as string,
	}));
}

/**
 * Get zones for dropdown options
 */
export async function getZones(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	const qs: IDataObject = {};
	if (accountId) {
		qs['account.id'] = accountId;
	}

	const response = await cloudflareApiRequest.call(this, 'GET', '/zones', {}, qs);
	const zones = response as unknown as IDataObject[];

	if (!Array.isArray(zones)) return [];

	return zones.map((zone) => ({
		name: zone.name as string,
		value: zone.id as string,
	}));
}

/**
 * Get KV namespaces for dropdown options
 */
export async function getKvNamespaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/storage/kv/namespaces`);
	const namespaces = response as unknown as IDataObject[];

	if (!Array.isArray(namespaces)) return [];

	return namespaces.map((ns) => ({
		name: ns.title as string,
		value: ns.id as string,
	}));
}

/**
 * Get D1 databases for dropdown options
 */
export async function getD1Databases(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/d1/database`);
	const databases = response as unknown as IDataObject[];

	if (!Array.isArray(databases)) return [];

	return databases.map((db) => ({
		name: db.name as string,
		value: db.uuid as string,
	}));
}

/**
 * Get Durable Object namespaces for dropdown options
 */
export async function getDoNamespaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/workers/durable_objects/namespaces`);
	const namespaces = response as unknown as IDataObject[];

	if (!Array.isArray(namespaces)) return [];

	return namespaces.map((ns) => ({
		name: (ns.name as string) || (ns.script as string) || (ns.id as string),
		value: ns.id as string,
	}));
}

/**
 * Get R2 Buckets for dropdown options
 */
export async function getR2Buckets(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/r2/buckets`);
	const responseObj = response as IDataObject;
	const buckets = responseObj.buckets as IDataObject[] | undefined;

	if (!buckets || !Array.isArray(buckets)) return [];

	return buckets.map((bucket) => ({
		name: bucket.name as string,
		value: bucket.name as string,
	}));
}

/**
 * Get Vectorize Indexes for dropdown options
 */
export async function getVectorizeIndexes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/vectorize/v2/indexes`);
	const indexes = response as unknown as IDataObject[];

	if (!Array.isArray(indexes)) return [];

	return indexes.map((index) => ({
		name: index.name as string,
		value: index.name as string,
	}));
}

/**
 * Get Queues for dropdown options
 */
export async function getQueues(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/queues`);
	const queues = response as unknown as IDataObject[];

	if (!Array.isArray(queues)) return [];

	return queues.map((queue) => ({
		name: queue.queue_name as string,
		value: queue.queue_name as string,
	}));
}

/**
 * Get AI Gateways for dropdown options
 */
export async function getAiGateways(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/ai-gateway/gateways`);
	const gateways = response as unknown as IDataObject[];

	if (!Array.isArray(gateways)) return [];

	return gateways.map((gateway) => ({
		name: gateway.id as string,
		value: gateway.id as string,
	}));
}

/**
 * Get Hyperdrive Configs for dropdown options
 */
export async function getHyperdriveConfigs(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/hyperdrive/configs`);
	const configs = response as unknown as IDataObject[];

	if (!Array.isArray(configs)) return [];

	return configs.map((config) => ({
		name: config.name as string,
		value: config.id as string,
	}));
}

/**
 * Get Workflows for dropdown options
 */
export async function getWorkflows(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/workflows`);
	const workflows = response as unknown as IDataObject[];

	if (!Array.isArray(workflows)) return [];

	return workflows.map((workflow) => ({
		name: workflow.name as string,
		value: workflow.name as string,
	}));
}

/**
 * Get Access Applications for dropdown options
 */
export async function getAccessApplications(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/access/apps`);
	const apps = response as unknown as IDataObject[];

	if (!Array.isArray(apps)) return [];

	return apps.map((app) => ({
		name: app.name as string,
		value: app.id as string,
	}));
}

/**
 * Get Tunnels for dropdown options
 */
export async function getTunnels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/tunnels`);
	const tunnels = response as unknown as IDataObject[];

	if (!Array.isArray(tunnels)) return [];

	return tunnels.map((tunnel) => ({
		name: tunnel.name as string,
		value: tunnel.id as string,
	}));
}

/**
 * Get Registrar Domains for dropdown options
 */
export async function getRegistrarDomains(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/registrar/domains`);
	const domains = response as unknown as IDataObject[];

	if (!Array.isArray(domains)) return [];

	return domains.map((domain) => ({
		name: domain.name as string,
		value: domain.name as string,
	}));
}

/**
 * Get Turnstile Widgets for dropdown options
 */
export async function getTurnstileWidgets(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/challenges/widgets`);
	const widgets = response as unknown as IDataObject[];

	if (!Array.isArray(widgets)) return [];

	return widgets.map((w) => ({
		name: w.name as string,
		value: w.sitekey as string,
	}));
}

/**
 * Get Pages Projects for dropdown options
 */
export async function getPagesProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/pages/projects`);
	const projects = response as unknown as IDataObject[];

	if (!Array.isArray(projects)) return [];

	return projects.map((project) => ({
		name: project.name as string,
		value: project.name as string,
	}));
}

/**
 * Get Worker Scripts for dropdown options
 */
export async function getWorkerScripts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	if (!accountId) return [];
	const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/workers/scripts`);
	const scripts = response as unknown as IDataObject[];

	if (!Array.isArray(scripts)) return [];

	return scripts.map((script) => ({
		name: script.id as string,
		value: script.id as string,
	}));
}

/**
 * Get Stream Videos for dropdown options
 */
export async function getStreamVideos(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const accountId = this.getNodeParameter('accountId', 0) as string;
		if (!accountId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/stream`);
		const videos = response as unknown as IDataObject[];

		if (!Array.isArray(videos)) return [];

		return videos.map((video) => ({
			name: ((video.meta as IDataObject)?.name as string) || (video.uid as string),
			value: video.uid as string,
		}));
	} catch {
		// Stream requires a paid subscription
		return [];
	}
}

/**
 * Get Images for dropdown options
 */
export async function getImages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const accountId = this.getNodeParameter('accountId', 0) as string;
		if (!accountId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/images/v1`);
		const images = response as unknown as IDataObject[];

		if (!Array.isArray(images)) return [];

		return images.map((image) => ({
			name: (image.filename as string) || (image.id as string),
			value: image.id as string,
		}));
	} catch {
		// Images requires a paid subscription
		return [];
	}
}

/**
 * Get Load Balancers for dropdown options
 */
export async function getLoadBalancers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const zoneId = this.getNodeParameter('zoneId', 0) as string;
		if (!zoneId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/load_balancers`);
		const lbs = response as unknown as IDataObject[];

		if (!Array.isArray(lbs)) return [];

		return lbs.map((lb) => ({
			name: lb.name as string,
			value: lb.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Load Balancer Pools for dropdown options
 */
export async function getLoadBalancerPools(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const accountId = this.getNodeParameter('accountId', 0) as string;
		if (!accountId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/load_balancers/pools`);
		const pools = response as unknown as IDataObject[];

		if (!Array.isArray(pools)) return [];

		return pools.map((pool) => ({
			name: pool.name as string,
			value: pool.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Load Balancer Monitors for dropdown options
 */
export async function getLoadBalancerMonitors(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const accountId = this.getNodeParameter('accountId', 0) as string;
		if (!accountId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/load_balancers/monitors`);
		const monitors = response as unknown as IDataObject[];

		if (!Array.isArray(monitors)) return [];

		return monitors.map((monitor) => ({
			name: (monitor.description as string) || (monitor.id as string),
			value: monitor.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Logpush Jobs for dropdown options
 */
export async function getLogpushJobs(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const scope = this.getNodeParameter('scope', 0) as string;
		let endpoint = '';
		if (scope === 'zone') {
			const zoneId = this.getNodeParameter('zoneId', 0) as string;
			if (!zoneId) return [];
			endpoint = `/zones/${zoneId}/logpush/jobs`;
		} else {
			const accountId = this.getNodeParameter('accountId', 0) as string;
			if (!accountId) return [];
			endpoint = `/accounts/${accountId}/logpush/jobs`;
		}
		const response = await cloudflareApiRequest.call(this, 'GET', endpoint);
		const jobs = response as unknown as IDataObject[];

		if (!Array.isArray(jobs)) return [];

		return jobs.map((job) => ({
			name: `Job ${job.id} - ${job.dataset || 'Unknown'}`,
			value: String(job.id),
		}));
	} catch {
		return [];
	}
}

/**
 * Get Rulesets for dropdown options
 */
export async function getRulesets(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const scope = this.getNodeParameter('scope', 0) as string;
		let endpoint = '';
		if (scope === 'zone') {
			const zoneId = this.getNodeParameter('zoneId', 0) as string;
			if (!zoneId) return [];
			endpoint = `/zones/${zoneId}/rulesets`;
		} else {
			const accountId = this.getNodeParameter('accountId', 0) as string;
			if (!accountId) return [];
			endpoint = `/accounts/${accountId}/rulesets`;
		}
		const response = await cloudflareApiRequest.call(this, 'GET', endpoint);
		const rulesets = response as unknown as IDataObject[];

		if (!Array.isArray(rulesets)) return [];

		return rulesets.map((rs) => ({
			name: (rs.name as string) || (rs.id as string),
			value: rs.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get DNS Records for dropdown options
 */
export async function getDnsRecords(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const zoneId = this.getNodeParameter('zoneId', 0) as string;
		if (!zoneId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/dns_records`);
		const records = response as unknown as IDataObject[];

		if (!Array.isArray(records)) return [];

		return records.map((record) => ({
			name: `${record.type}: ${record.name}`,
			value: record.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Page Rules for dropdown options
 */
export async function getPageRules(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const zoneId = this.getNodeParameter('zoneId', 0) as string;
		if (!zoneId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/pagerules`);
		const rules = response as unknown as IDataObject[];

		if (!Array.isArray(rules)) return [];

		return rules.map((rule) => ({
			name: `${((rule.targets as IDataObject[])?.[0]?.constraint as IDataObject)?.value || rule.id}`,
			value: rule.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Waiting Rooms for dropdown options
 */
export async function getWaitingRooms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const zoneId = this.getNodeParameter('zoneId', 0) as string;
		if (!zoneId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/waiting_rooms`);
		const rooms = response as unknown as IDataObject[];

		if (!Array.isArray(rooms)) return [];

		return rooms.map((room) => ({
			name: room.name as string,
			value: room.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Custom Hostnames for dropdown options
 */
export async function getCustomHostnames(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const zoneId = this.getNodeParameter('zoneId', 0) as string;
		if (!zoneId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/custom_hostnames`);
		const hostnames = response as unknown as IDataObject[];

		if (!Array.isArray(hostnames)) return [];

		return hostnames.map((hostname) => ({
			name: hostname.hostname as string,
			value: hostname.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Spectrum Apps for dropdown options
 */
export async function getSpectrumApps(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const zoneId = this.getNodeParameter('zoneId', 0) as string;
		if (!zoneId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/spectrum/apps`);
		const apps = response as unknown as IDataObject[];

		if (!Array.isArray(apps)) return [];

		return apps.map((app) => ({
			name: (app.dns as IDataObject)?.name as string || app.id as string,
			value: app.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Healthchecks for dropdown options
 */
export async function getHealthchecks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const zoneId = this.getNodeParameter('zoneId', 0) as string;
		if (!zoneId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/healthchecks`);
		const checks = response as unknown as IDataObject[];

		if (!Array.isArray(checks)) return [];

		return checks.map((check) => ({
			name: check.name as string,
			value: check.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Filters for dropdown options
 */
export async function getFilters(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const zoneId = this.getNodeParameter('zoneId', 0) as string;
		if (!zoneId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/filters`);
		const filters = response as unknown as IDataObject[];

		if (!Array.isArray(filters)) return [];

		return filters.map((filter) => ({
			name: (filter.expression as string)?.substring(0, 50) || filter.id as string,
			value: filter.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Lists for dropdown options
 */
export async function getLists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const accountId = this.getNodeParameter('accountId', 0) as string;
		if (!accountId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/rules/lists`);
		const lists = response as unknown as IDataObject[];

		if (!Array.isArray(lists)) return [];

		return lists.map((list) => ({
			name: list.name as string,
			value: list.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Access Groups for dropdown options
 */
export async function getAccessGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const accountId = this.getNodeParameter('accountId', 0) as string;
		if (!accountId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/access/groups`);
		const groups = response as unknown as IDataObject[];

		if (!Array.isArray(groups)) return [];

		return groups.map((group) => ({
			name: group.name as string,
			value: group.id as string,
		}));
	} catch {
		return [];
	}
}

/**
 * Get Identity Providers for dropdown options
 */
export async function getIdentityProviders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const accountId = this.getNodeParameter('accountId', 0) as string;
		if (!accountId) return [];
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/access/identity_providers`);
		const providers = response as unknown as IDataObject[];

		if (!Array.isArray(providers)) return [];

		return providers.map((provider) => ({
			name: provider.name as string,
			value: provider.id as string,
		}));
	} catch {
		return [];
	}
}

