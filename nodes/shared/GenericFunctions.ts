import {
	IExecuteFunctions,
	IHttpRequestMethods,
	IDataObject,
	NodeApiError,
	NodeOperationError,
	JsonObject,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

/**
 * Cloudflare plan levels
 */
export type CloudflarePlan = 'free' | 'pro' | 'business' | 'enterprise';

/**
 * Features and their minimum required plan
 */
export const FEATURE_PLAN_REQUIREMENTS: Record<string, CloudflarePlan> = {
	// Enterprise-only features
	'magic_transit': 'enterprise',
	'magic_wan': 'enterprise',
	'spectrum': 'enterprise',
	'bot_management': 'enterprise',
	'load_balancing_adaptive_routing': 'enterprise',
	'custom_ssl': 'enterprise',
	'rate_limiting_advanced': 'enterprise',
	'waf_custom_rules_advanced': 'enterprise',

	// Business+ features
	'custom_certificates': 'business',
	'waf_custom_rules': 'business',
	'load_balancing': 'business',

	// Pro+ features
	'waf': 'pro',
	'polish': 'pro',
	'mirage': 'pro',
};

/**
 * Check if a feature requires a specific plan and throw a helpful error if not available
 */
export function checkFeaturePlanRequirement(
	this: IExecuteFunctions,
	featureName: string,
	itemIndex: number,
): void {
	const requiredPlan = FEATURE_PLAN_REQUIREMENTS[featureName];
	if (requiredPlan) {
		// We can't check the actual plan via API without additional calls,
		// so we just add a note that this feature may require a specific plan
		// The actual check will happen when the API returns an error
	}
}

/**
 * Handle API errors with plan-specific messaging
 */
export function handleCloudflareApiError(
	this: IExecuteFunctions,
	error: JsonObject,
	featureName?: string,
): never {
	const errorMessage = (error as { message?: string }).message || '';
	const errorCode = (error as { code?: number }).code;

	// Check for common plan-related error patterns
	if (
		errorMessage.includes('not available on your plan') ||
		errorMessage.includes('requires an Enterprise') ||
		errorMessage.includes('upgrade your plan') ||
		errorCode === 1004 ||
		errorCode === 1006
	) {
		const requiredPlan = featureName ? FEATURE_PLAN_REQUIREMENTS[featureName] : 'enterprise';
		throw new NodeOperationError(
			this.getNode(),
			`This feature requires a Cloudflare ${requiredPlan?.toUpperCase() || 'paid'} plan. ` +
			`Please upgrade your Cloudflare account or contact Cloudflare sales for access.`,
			{
				description: `Feature: ${featureName || 'Unknown'}. ` +
					`Original error: ${errorMessage}`,
			},
		);
	}

	// Re-throw as NodeApiError for other errors
	throw new NodeApiError(this.getNode(), error);
}

/**
 * Make an API request to Cloudflare with enhanced error handling
 */
export async function cloudflareApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	featureName?: string,
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method,
		url: `https://api.cloudflare.com/client/v4${endpoint}`,
		json: true,
	};

	if (Object.keys(body).length > 0) {
		options.body = body;
	}

	if (Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'cloudflareApi',
			options,
		);

		if (response.success === false) {
			const errorInfo = response.errors?.[0] || {};
			const errorMessage = errorInfo.message || 'Unknown error';
			const errorCode = errorInfo.code;

			// Check for plan-related errors
			if (
				errorMessage.includes('not available') ||
				errorMessage.includes('requires') ||
				errorMessage.includes('upgrade') ||
				errorMessage.includes('Enterprise') ||
				errorCode === 1004 ||
				errorCode === 1006 ||
				errorCode === 1015
			) {
				const requiredPlan = featureName ? FEATURE_PLAN_REQUIREMENTS[featureName] : null;
				throw new NodeApiError(this.getNode(), response as JsonObject, {
					message: `This feature may require a Cloudflare ${requiredPlan?.toUpperCase() || 'higher-tier'} plan. ` +
						`Error: ${errorMessage}`,
				});
			}

			throw new NodeApiError(this.getNode(), response as JsonObject, {
				message: errorMessage,
			});
		}

		return response.result as IDataObject;
	} catch (error) {
		// Enhanced error handling for common plan-related HTTP errors
		const err = error as { statusCode?: number; message?: string };
		if (err.statusCode === 403) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: `Access denied. This feature may require a higher Cloudflare plan or additional permissions.`,
			});
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an API request to Cloudflare and return all results (handles pagination)
 */
export async function cloudflareApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	featureName?: string,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let page = 1;
	const perPage = 100;

	qs.per_page = perPage;

	let hasMore = true;

	while (hasMore) {
		qs.page = page;

		const response = await cloudflareApiRequest.call(this, method, endpoint, body, qs, featureName);

		if (Array.isArray(response)) {
			returnData.push(...(response as IDataObject[]));
			hasMore = response.length === perPage;
		} else if (response) {
			returnData.push(response);
			hasMore = false;
		} else {
			hasMore = false;
		}

		page++;
	}

	return returnData;
}

/**
 * Display a warning notice for enterprise features
 */
export function getEnterprisePlanNotice(featureName: string): string {
	return `⚠️ ${featureName} is an Enterprise-only feature. ` +
		`If you don't have an Enterprise plan, this operation will fail.`;
}
