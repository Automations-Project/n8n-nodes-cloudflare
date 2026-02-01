import { CloudflareDns } from './CloudflareDns.node';

describe('CloudflareDns Node', () => {
	let node: CloudflareDns;

	beforeEach(() => {
		node = new CloudflareDns();
	});

	describe('Node Metadata', () => {
		it('should have correct display name', () => {
			expect(node.description.displayName).toBe('Cloudflare DNS');
		});

		it('should have correct internal name', () => {
			expect(node.description.name).toBe('cloudflareDns');
		});

		it('should have an icon defined', () => {
			expect(node.description.icon).toBe('file:cloudflare.svg');
		});

		it('should have version 1', () => {
			expect(node.description.version).toBe(1);
		});

		it('should be usable as tool', () => {
			expect(node.description.usableAsTool).toBe(true);
		});
	});

	describe('Node Configuration', () => {
		it('should require Cloudflare API credentials', () => {
			const creds = node.description.credentials;
			expect(creds).toBeDefined();
			expect(creds?.length).toBe(1);
			expect(creds?.[0].name).toBe('cloudflareApi');
			expect(creds?.[0].required).toBe(true);
		});

		it('should have main input', () => {
			expect(node.description.inputs).toContain('main');
		});

		it('should have main output', () => {
			expect(node.description.outputs).toContain('main');
		});

		it('should use Cloudflare API v4 as base URL', () => {
			expect(node.description.requestDefaults?.baseURL).toBe('https://api.cloudflare.com/client/v4');
		});
	});

	describe('Resources', () => {
		it('should have resource property as first property', () => {
			const resourceProp = node.description.properties[0];
			expect(resourceProp.name).toBe('resource');
			expect(resourceProp.type).toBe('options');
		});

		it('should have dnsRecord as default resource', () => {
			const resourceProp = node.description.properties[0];
			expect(resourceProp.default).toBe('dnsRecord');
		});

		it('should include expected resource options', () => {
			const resourceProp = node.description.properties[0];
			const options = resourceProp.options as Array<{ value: string }>;
			const resourceValues = options.map((o) => o.value);

			expect(resourceValues).toContain('dnsRecord');
			expect(resourceValues).toContain('dnssec');
			expect(resourceValues).toContain('dnsSettings');
			expect(resourceValues).toContain('batch');
			expect(resourceValues).toContain('scan');
		});
	});

	describe('Load Options Methods', () => {
		it('should have getZones method', () => {
			expect(node.methods?.loadOptions?.getZones).toBeDefined();
		});

		it('should have getAccounts method', () => {
			expect(node.methods?.loadOptions?.getAccounts).toBeDefined();
		});
	});

	describe('Execute Method', () => {
		it('should have execute method defined', () => {
			expect(node.execute).toBeDefined();
			expect(typeof node.execute).toBe('function');
		});
	});
});
