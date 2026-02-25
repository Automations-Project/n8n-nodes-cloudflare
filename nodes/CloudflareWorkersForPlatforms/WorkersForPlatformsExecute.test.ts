import { IExecuteFunctions } from 'n8n-workflow';
import { workersForPlatformsExecute } from './WorkersForPlatformsExecute';
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
		getNode: jest.fn(() => ({ name: 'Cloudflare Workers for Platforms' })),
		helpers: {
			httpRequestWithAuthentication: jest.fn(async () => response),
		},
	} as unknown as IExecuteFunctions;
}

describe('workersForPlatformsExecute upload', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('handles dispatchScript uploads with multipart metadata and file content', async () => {
		const context = createExecuteContext(
			{
				resource: 'dispatchScript',
				operation: 'upload',
				accountId: 'acc123',
				dispatchNamespace: 'tenant-a',
				scriptName: 'my-script',
				scriptContent: 'addEventListener("fetch", () => {})',
				uploadOptions: {
					moduleType: 'sw',
					compatibilityDate: '2026-02-25',
				},
			},
			{
				success: true,
				result: { id: 'my-script' },
			},
		);

		const result = await workersForPlatformsExecute.call(context, 0);

		const requestCall = (context.helpers.httpRequestWithAuthentication as jest.Mock).mock.calls[0];
		expect(requestCall[0]).toBe('cloudflareApi');

		const requestOptions = requestCall[1] as {
			method: string;
			url: string;
			formData: {
				metadata: { value: Buffer };
				files: { value: Buffer; options: { contentType: string } };
			};
		};

		expect(requestOptions.method).toBe('PUT');
		expect(requestOptions.url).toBe(
			'https://api.cloudflare.com/client/v4/accounts/acc123/workers/dispatch/namespaces/tenant-a/scripts/my-script',
		);
		expect(requestOptions.formData.files.options.contentType).toBe('application/javascript');
		expect(requestOptions.formData.files.value.toString('utf-8')).toContain('addEventListener');

		const metadata = JSON.parse(requestOptions.formData.metadata.value.toString('utf-8'));
		expect(metadata).toEqual({
			body_part: 'worker.js',
			compatibility_date: '2026-02-25',
		});

		expect(mockCloudflareApiRequest).not.toHaveBeenCalled();
		expect(mockCloudflareApiRequestAllItems).not.toHaveBeenCalled();
		expect(result).toEqual([{ json: { id: 'my-script' } }]);
	});
});
