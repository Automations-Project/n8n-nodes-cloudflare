import { CloudflareApi } from './CloudflareApi.credentials';

describe('CloudflareApi Credentials', () => {
	let credentials: CloudflareApi;

	beforeEach(() => {
		credentials = new CloudflareApi();
	});

	describe('Credential Metadata', () => {
		it('should have correct name', () => {
			expect(credentials.name).toBe('cloudflareApi');
		});

		it('should have correct display name', () => {
			expect(credentials.displayName).toBe('Cloudflare API');
		});

		it('should have documentation URL', () => {
			expect(credentials.documentationUrl).toContain('cloudflare.com');
		});
	});

	describe('Credential Properties', () => {
		it('should have apiToken property', () => {
			const apiToken = credentials.properties.find((p) => p.name === 'apiToken');
			expect(apiToken).toBeDefined();
			expect(apiToken?.type).toBe('string');
			expect(apiToken?.required).toBe(true);
		});

		it('should have apiToken marked as password', () => {
			const apiToken = credentials.properties.find((p) => p.name === 'apiToken');
			expect(apiToken?.typeOptions).toEqual({ password: true });
		});

		it('should have accountId property', () => {
			const accountId = credentials.properties.find((p) => p.name === 'accountId');
			expect(accountId).toBeDefined();
			expect(accountId?.type).toBe('string');
		});

		it('should have exactly 2 properties', () => {
			expect(credentials.properties.length).toBe(2);
		});
	});

	describe('Authentication Configuration', () => {
		it('should use generic authentication type', () => {
			expect(credentials.authenticate.type).toBe('generic');
		});

		it('should configure Bearer token in Authorization header', () => {
			const authHeader = credentials.authenticate.properties?.headers?.Authorization;
			expect(authHeader).toBe('=Bearer {{$credentials.apiToken}}');
		});
	});

	describe('Credential Test Request', () => {
		it('should test against Cloudflare API v4', () => {
			expect(credentials.test.request.baseURL).toBe('https://api.cloudflare.com/client/v4');
		});

		it('should use token verify endpoint', () => {
			expect(credentials.test.request.url).toBe('/user/tokens/verify');
		});

		it('should use GET method for testing', () => {
			expect(credentials.test.request.method).toBe('GET');
		});
	});
});
