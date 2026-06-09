import {
	IExecuteFunctions,
	IHttpRequestMethods,
	IDataObject,
	NodeApiError,
	NodeOperationError,
	JsonObject,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IPollFunctions,
	IHookFunctions,
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
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions | IHookFunctions,
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
		// Extract detailed error info from HTTP errors
		// n8n wraps HTTP errors with various structures depending on the error type
		const err = error as {
			statusCode?: number;
			message?: string;
			cause?: {
				error?: { errors?: Array<{ message?: string; code?: number }> };
				response?: { body?: unknown };
			};
			response?: { body?: string | { errors?: Array<{ message?: string; code?: number }> } };
			httpCode?: string;
			description?: string;
			error?: { errors?: Array<{ message?: string; code?: number }> };
		};

		// Try to extract Cloudflare error details from various error structures
		// n8n can wrap errors in different ways depending on the HTTP client used
		let cfErrors: Array<{ message?: string; code?: number }> | undefined;

		// Check direct error.error.errors (common in n8n HTTP responses)
		if (err.error?.errors) {
			cfErrors = err.error.errors;
		}
		// Check cause.error.errors
		else if (err.cause?.error?.errors) {
			cfErrors = err.cause.error.errors;
		}
		// Check cause.response.body (axios-style)
		else if (err.cause?.response?.body) {
			const body = err.cause.response.body;
			if (typeof body === 'object' && body !== null && 'errors' in body) {
				cfErrors = (body as { errors: Array<{ message?: string; code?: number }> }).errors;
			}
		}
		// Check response.body object
		else if (err.response?.body && typeof err.response.body === 'object') {
			cfErrors = err.response.body.errors;
		}
		// Check response.body string (needs parsing)
		else if (err.response?.body && typeof err.response.body === 'string') {
			try {
				const parsed = JSON.parse(err.response.body);
				cfErrors = parsed.errors;
			} catch {
				// Ignore parse errors
			}
		}

		const cfErrorMessage = cfErrors?.[0]?.message;
		const cfErrorCode = cfErrors?.[0]?.code;
		const httpCode = err.httpCode || (err.statusCode ? String(err.statusCode) : undefined);

		// Build descriptive error message
		const allErrors = cfErrors?.map(e => e.message).filter(Boolean).join('; ');

		if (err.statusCode === 403) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: cfErrorMessage || 'Access denied',
				description: 'This feature may require a higher Cloudflare plan or additional permissions.',
				httpCode,
			});
		}

		if (cfErrorMessage) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: cfErrorMessage,
				description: allErrors !== cfErrorMessage ? allErrors : (cfErrorCode ? `Error code: ${cfErrorCode}` : undefined),
				httpCode,
			});
		}

		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: err.message || 'Cloudflare API request failed',
			httpCode,
		});
	}
}

/**
 * Make an API request to Cloudflare with a raw request body.
 * Used by endpoints like R2 object upload that expect bytes instead of JSON payloads.
 */
export async function cloudflareApiRequestRaw(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	rawBody: Buffer | string,
	headers: IDataObject = {},
	itemIndex?: number,
	qs: IDataObject = {},
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method,
		url: `https://api.cloudflare.com/client/v4${endpoint}`,
		body: rawBody,
		json: false,
		returnFullResponse: false,
	};

	if (Object.keys(headers).length > 0) {
		options.headers = headers;
	}
	if (Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	try {
		const responseValue = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'cloudflareApi',
			options,
		);

		let response: IDataObject;
		if (typeof responseValue === 'string') {
			// Cloudflare v4 endpoints usually return JSON; treat non-JSON as empty success payload.
			try {
				response = JSON.parse(responseValue);
			} catch {
				return {};
			}
		} else if (typeof responseValue === 'object' && responseValue !== null) {
			response = responseValue as IDataObject;
		} else {
			return {};
		}

		if (response.success === false) {
			const errors = response.errors as Array<{ message?: string; code?: number }> | undefined;
			const errorMessage = errors?.[0]?.message || 'Unknown error';
			const errorCode = errors?.[0]?.code;
			const allErrors = errors?.map((e) => e.message).filter(Boolean).join('; ');

			throw new NodeApiError(this.getNode(), response as JsonObject, {
				message: errorMessage,
				description:
					allErrors !== errorMessage
						? allErrors
						: (errorCode ? `Error code: ${errorCode}` : undefined),
				itemIndex,
			});
		}

		if (response.result && typeof response.result === 'object') {
			return response.result as IDataObject;
		}

		return response;
	} catch (error) {
		if (error instanceof NodeApiError || error instanceof NodeOperationError) {
			throw error;
		}

		// Extract detailed error info from HTTP errors
		// n8n wraps HTTP errors with various structures depending on the error type
		const err = error as {
			statusCode?: number;
			message?: string;
			cause?: {
				error?: { errors?: Array<{ message?: string; code?: number }> };
				response?: { body?: unknown };
			};
			response?: { body?: string | { errors?: Array<{ message?: string; code?: number }> } };
			httpCode?: string;
			description?: string;
			error?: { errors?: Array<{ message?: string; code?: number }> };
		};

		// Try to extract Cloudflare error details from various error structures
		// n8n can wrap errors in different ways depending on the HTTP client used
		let cfErrors: Array<{ message?: string; code?: number }> | undefined;

		// Check direct error.error.errors (common in n8n HTTP responses)
		if (err.error?.errors) {
			cfErrors = err.error.errors;
		}
		// Check cause.error.errors
		else if (err.cause?.error?.errors) {
			cfErrors = err.cause.error.errors;
		}
		// Check cause.response.body (axios-style)
		else if (err.cause?.response?.body) {
			const body = err.cause.response.body;
			if (typeof body === 'object' && body !== null && 'errors' in body) {
				cfErrors = (body as { errors: Array<{ message?: string; code?: number }> }).errors;
			}
		}
		// Check response.body object
		else if (err.response?.body && typeof err.response.body === 'object') {
			cfErrors = err.response.body.errors;
		}
		// Check response.body string (needs parsing)
		else if (err.response?.body && typeof err.response.body === 'string') {
			try {
				const parsed = JSON.parse(err.response.body);
				cfErrors = parsed.errors;
			} catch {
				// Ignore parse errors
			}
		}

		const cfErrorMessage = cfErrors?.[0]?.message;
		const cfErrorCode = cfErrors?.[0]?.code;
		const httpCode = err.httpCode || (err.statusCode ? String(err.statusCode) : undefined);

		// Build descriptive error message
		const allErrors = cfErrors?.map((e) => e.message).filter(Boolean).join('; ');

		if (err.statusCode === 403) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: cfErrorMessage || 'Access denied',
				description: 'This feature may require a higher Cloudflare plan or additional permissions.',
				httpCode,
				itemIndex,
			});
		}

		if (cfErrorMessage) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: cfErrorMessage,
				description:
					allErrors !== cfErrorMessage
						? allErrors
						: (cfErrorCode ? `Error code: ${cfErrorCode}` : undefined),
				httpCode,
				itemIndex,
			});
		}

		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: err.message || 'Cloudflare raw request failed',
			httpCode,
			itemIndex,
		});
	}
}

/**
 * Download a raw/binary object from Cloudflare (e.g. R2 object content).
 *
 * Unlike `cloudflareApiRequest` (which expects a JSON `{ success, result }`
 * envelope) this returns the raw bytes together with the response
 * `Content-Type` so the caller can surface the data as text or as an n8n
 * binary property. Used by the R2 object "Get" (download) operation.
 */
export async function cloudflareApiRequestDownload(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	qs: IDataObject = {},
	itemIndex?: number,
): Promise<{ body: Buffer; contentType?: string }> {
	const options: IHttpRequestOptions = {
		method,
		url: `https://api.cloudflare.com/client/v4${endpoint}`,
		encoding: 'arraybuffer',
		returnFullResponse: true,
		json: false,
	};

	if (Object.keys(qs).length > 0) {
		options.qs = qs;
	}

	try {
		const response = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'cloudflareApi',
			options,
		)) as { body?: unknown; headers?: IDataObject };

		const rawBody = response.body;
		let body: Buffer;
		if (Buffer.isBuffer(rawBody)) {
			body = rawBody;
		} else if (rawBody instanceof ArrayBuffer) {
			body = Buffer.from(new Uint8Array(rawBody));
		} else if (rawBody instanceof Uint8Array) {
			body = Buffer.from(rawBody);
		} else if (typeof rawBody === 'string') {
			body = Buffer.from(rawBody, 'utf-8');
		} else {
			body = Buffer.alloc(0);
		}

		const headers = (response.headers ?? {}) as IDataObject;
		const contentType = headers['content-type'] as string | undefined;

		return { body, contentType };
	} catch (error) {
		const err = error as {
			statusCode?: number;
			message?: string;
			httpCode?: string;
			response?: { body?: unknown };
		};

		// Cloudflare returns a JSON error envelope even for download endpoints.
		let cfErrors: Array<{ message?: string; code?: number }> | undefined;
		const errorBody = err.response?.body;
		if (errorBody) {
			let parsed: { errors?: Array<{ message?: string; code?: number }> } | undefined;
			if (Buffer.isBuffer(errorBody)) {
				try {
					parsed = JSON.parse(errorBody.toString('utf-8'));
				} catch {
					// Ignore non-JSON error bodies
				}
			} else if (typeof errorBody === 'string') {
				try {
					parsed = JSON.parse(errorBody);
				} catch {
					// Ignore non-JSON error bodies
				}
			} else if (typeof errorBody === 'object') {
				parsed = errorBody as { errors?: Array<{ message?: string; code?: number }> };
			}
			cfErrors = parsed?.errors;
		}

		const cfErrorMessage = cfErrors?.[0]?.message;
		const httpCode = err.httpCode || (err.statusCode ? String(err.statusCode) : undefined);

		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: cfErrorMessage || err.message || 'Cloudflare object download failed',
			httpCode,
			itemIndex,
		});
	}
}

/**
 * Make an API request to Cloudflare with NDJSON body format
 * Used for Vectorize insert/upsert operations that require application/x-ndjson
 * Cloudflare expects multipart form-data with a 'body' field containing the NDJSON
 */
export async function cloudflareApiRequestNdjson(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	vectors: IDataObject[],
	itemIndex: number,
): Promise<IDataObject> {
	// Convert vectors array to NDJSON format (newline-delimited JSON)
	const ndjsonBody = vectors.map((v) => JSON.stringify(v)).join('\n') + '\n';

	// Cloudflare Vectorize upsert/insert expects raw NDJSON body
	const options: IHttpRequestOptions = {
		method,
		url: `https://api.cloudflare.com/client/v4${endpoint}`,
		body: Buffer.from(ndjsonBody, 'utf-8'),
		headers: {
			'Content-Type': 'application/x-ndjson',
		},
		json: false,
		returnFullResponse: false,
	};

	try {
		const responseText = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'cloudflareApi',
			options,
		);

		// Parse JSON response
		let response: IDataObject;
		try {
			response = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;
		} catch {
			throw new NodeOperationError(
				this.getNode(),
				`Failed to parse Cloudflare response: ${responseText}`,
				{ itemIndex },
			);
		}

		if (response.success === false) {
			const errors = response.errors as Array<{ message?: string; code?: number }> | undefined;
			const errorMessage = errors?.[0]?.message || 'Unknown Vectorize error';
			const errorCode = errors?.[0]?.code;
			const allErrors = errors?.map(e => e.message).filter(Boolean).join('; ');

			throw new NodeApiError(this.getNode(), response as JsonObject, {
				message: errorMessage,
				description: allErrors !== errorMessage ? allErrors : (errorCode ? `Error code: ${errorCode}` : undefined),
				itemIndex,
			});
		}

		return response.result as IDataObject;
	} catch (error) {
		if (error instanceof NodeApiError || error instanceof NodeOperationError) {
			throw error;
		}
		// Extract detailed error info from HTTP errors
		// n8n wraps HTTP errors with various structures depending on the error type
		const err = error as {
			statusCode?: number;
			message?: string;
			cause?: {
				error?: { errors?: Array<{ message?: string; code?: number }> };
				response?: { body?: unknown };
			};
			response?: { body?: string | { errors?: Array<{ message?: string; code?: number }> } };
			httpCode?: string;
			description?: string;
			error?: { errors?: Array<{ message?: string; code?: number }> };
		};

		// Try to extract Cloudflare error details from various error structures
		// n8n can wrap errors in different ways depending on the HTTP client used
		let cfErrors: Array<{ message?: string; code?: number }> | undefined;

		// Check direct error.error.errors (common in n8n HTTP responses)
		if (err.error?.errors) {
			cfErrors = err.error.errors;
		}
		// Check cause.error.errors
		else if (err.cause?.error?.errors) {
			cfErrors = err.cause.error.errors;
		}
		// Check cause.response.body (axios-style)
		else if (err.cause?.response?.body) {
			const body = err.cause.response.body;
			if (typeof body === 'object' && body !== null && 'errors' in body) {
				cfErrors = (body as { errors: Array<{ message?: string; code?: number }> }).errors;
			}
		}
		// Check response.body object
		else if (err.response?.body && typeof err.response.body === 'object') {
			cfErrors = err.response.body.errors;
		}
		// Check response.body string (needs parsing)
		else if (err.response?.body && typeof err.response.body === 'string') {
			try {
				const parsed = JSON.parse(err.response.body);
				cfErrors = parsed.errors;
			} catch {
				// Ignore parse errors
			}
		}

		const cfErrorMessage = cfErrors?.[0]?.message;
		const cfErrorCode = cfErrors?.[0]?.code;
		const httpCode = err.httpCode || (err.statusCode ? String(err.statusCode) : undefined);

		// Build descriptive error message
		const allErrors = cfErrors?.map(e => e.message).filter(Boolean).join('; ');

		if (err.statusCode === 403) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: cfErrorMessage || 'Access denied',
				description: 'This feature may require a higher Cloudflare plan or additional permissions.',
				httpCode,
				itemIndex,
			});
		}

		if (cfErrorMessage) {
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: cfErrorMessage,
				description: allErrors !== cfErrorMessage ? allErrors : (cfErrorCode ? `Error code: ${cfErrorCode}` : undefined),
				httpCode,
				itemIndex,
			});
		}

		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: err.message || 'Vectorize request failed',
			httpCode,
			itemIndex,
		});
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
