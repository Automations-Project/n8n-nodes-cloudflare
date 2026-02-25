import { IExecuteFunctions } from 'n8n-workflow';
import { workersScriptExecute } from './WorkersScriptExecute';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

jest.mock('../shared/GenericFunctions', () => ({
	cloudflareApiRequest: jest.fn(),
	cloudflareApiRequestAllItems: jest.fn(),
}));

const mockCloudflareApiRequest = cloudflareApiRequest as jest.MockedFunction<typeof cloudflareApiRequest>;
const mockCloudflareApiRequestAllItems = cloudflareApiRequestAllItems as jest.MockedFunction<
	typeof cloudflareApiRequestAllItems
>;

function createExecuteContext(
	parameters: Record<string, unknown>,
	response: Record<string, unknown>,
): IExecuteFunctions {
	return {
		getNodeParameter: jest.fn((name: string) => parameters[name]),
		getNode: jest.fn(() => ({ name: 'Cloudflare Workers' })),
		helpers: {
			httpRequestWithAuthentication: jest.fn(async () => response),
		},
	} as unknown as IExecuteFunctions;
}

describe('workersScriptExecute upload', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('uploads module worker using multipart metadata and files', async () => {
		const context = createExecuteContext(
			{
				operation: 'upload',
				accountId: 'acc123',
				scriptName: 'my-worker',
				scriptContent: 'export default { fetch() { return new Response("ok"); } }',
				uploadOptions: {
					moduleType: 'esm',
					compatibilityDate: '2026-02-25',
				},
			},
			{
				success: true,
				result: { id: 'my-worker' },
			},
		);

		const result = await workersScriptExecute.call(context, 0);

		const requestCall = (context.helpers.httpRequestWithAuthentication as jest.Mock).mock.calls[0];
		expect(requestCall[0]).toBe('cloudflareApi');

		const requestOptions = requestCall[1] as {
			method: string;
			url: string;
			formData: {
				metadata: { value: Buffer; options: { contentType: string } };
				files: { value: Buffer; options: { contentType: string; filename: string } };
			};
		};

		expect(requestOptions.method).toBe('PUT');
		expect(requestOptions.url).toBe('https://api.cloudflare.com/client/v4/accounts/acc123/workers/scripts/my-worker');
		expect(requestOptions.formData.files.options.filename).toBe('worker.js');
		expect(requestOptions.formData.files.options.contentType).toBe('application/javascript+module');
		expect(requestOptions.formData.files.value.toString('utf-8')).toContain('export default');

		const metadata = JSON.parse(requestOptions.formData.metadata.value.toString('utf-8'));
		expect(metadata).toEqual({
			main_module: 'worker.js',
			compatibility_date: '2026-02-25',
		});

		expect(mockCloudflareApiRequest).not.toHaveBeenCalled();
		expect(mockCloudflareApiRequestAllItems).not.toHaveBeenCalled();
		expect(result).toEqual([{ json: { id: 'my-worker' }, pairedItem: { item: 0 } }]);
	});

	it('uses service worker metadata for moduleType sw', async () => {
		const context = createExecuteContext(
			{
				operation: 'upload',
				accountId: 'acc123',
				scriptName: 'my-sw',
				scriptContent: 'addEventListener("fetch", () => {})',
				uploadOptions: {
					moduleType: 'sw',
				},
			},
			{
				success: true,
				result: { id: 'my-sw' },
			},
		);

		await workersScriptExecute.call(context, 0);

		const requestCall = (context.helpers.httpRequestWithAuthentication as jest.Mock).mock.calls[0];
		const requestOptions = requestCall[1] as {
			formData: {
				metadata: { value: Buffer };
				files: { options: { contentType: string } };
			};
		};
		const metadata = JSON.parse(requestOptions.formData.metadata.value.toString('utf-8'));

		expect(metadata).toEqual({
			body_part: 'worker.js',
		});
		expect(requestOptions.formData.files.options.contentType).toBe('application/javascript');
	});
});
