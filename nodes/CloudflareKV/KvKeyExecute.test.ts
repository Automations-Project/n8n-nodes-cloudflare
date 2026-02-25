import { IExecuteFunctions } from 'n8n-workflow';
import { kvKeyExecute } from './KvKeyExecute';
import {
	cloudflareApiRequest,
	cloudflareApiRequestAllItems,
	cloudflareApiRequestRaw,
} from '../shared/GenericFunctions';

jest.mock('../shared/GenericFunctions', () => ({
	cloudflareApiRequest: jest.fn(),
	cloudflareApiRequestAllItems: jest.fn(),
	cloudflareApiRequestRaw: jest.fn(),
}));

const mockCloudflareApiRequest = cloudflareApiRequest as jest.MockedFunction<typeof cloudflareApiRequest>;
const mockCloudflareApiRequestAllItems = cloudflareApiRequestAllItems as jest.MockedFunction<
	typeof cloudflareApiRequestAllItems
>;
const mockCloudflareApiRequestRaw = cloudflareApiRequestRaw as jest.MockedFunction<
	typeof cloudflareApiRequestRaw
>;

function createExecuteContext(parameters: Record<string, unknown>): IExecuteFunctions {
	return {
		getNodeParameter: jest.fn((name: string) => parameters[name]),
		getNode: jest.fn(() => ({ name: 'Cloudflare KV' })),
	} as unknown as IExecuteFunctions;
}

describe('kvKeyExecute write', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('writes key value using raw body transport with query options', async () => {
		mockCloudflareApiRequestRaw.mockResolvedValueOnce({} as never);

		const context = createExecuteContext({
			operation: 'write',
			accountId: 'acc123',
			namespaceId: 'ns123',
			keyName: 'my-key',
			value: 'hello',
			writeOptions: {
				expiration_ttl: 3600,
				metadata: '{"source":"n8n"}',
			},
		});

		const result = await kvKeyExecute.call(context, 0);

		expect(mockCloudflareApiRequestRaw).toHaveBeenCalledTimes(1);
		expect(mockCloudflareApiRequestRaw).toHaveBeenCalledWith(
			'PUT',
			'/accounts/acc123/storage/kv/namespaces/ns123/values/my-key',
			Buffer.from('hello', 'utf-8'),
			{ 'Content-Type': 'text/plain; charset=utf-8' },
			0,
			{
				expiration_ttl: 3600,
				metadata: '{"source":"n8n"}',
			},
		);
		expect(mockCloudflareApiRequest).not.toHaveBeenCalled();
		expect(mockCloudflareApiRequestAllItems).not.toHaveBeenCalled();
		expect(result).toEqual([{ json: { success: true, key: 'my-key' }, pairedItem: { item: 0 } }]);
	});

	it('throws when metadata is invalid JSON', async () => {
		const context = createExecuteContext({
			operation: 'write',
			accountId: 'acc123',
			namespaceId: 'ns123',
			keyName: 'my-key',
			value: 'hello',
			writeOptions: {
				metadata: '{invalid',
			},
		});

		await expect(kvKeyExecute.call(context, 0)).rejects.toThrow('Metadata must be valid JSON');
		expect(mockCloudflareApiRequestRaw).not.toHaveBeenCalled();
	});
});
