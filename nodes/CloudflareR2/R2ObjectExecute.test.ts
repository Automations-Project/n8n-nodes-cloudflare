import { IExecuteFunctions } from 'n8n-workflow';
import { r2ObjectExecute } from './R2ObjectExecute';
import {
	cloudflareApiRequest,
	cloudflareApiRequestAllItems,
	cloudflareApiRequestDownload,
	cloudflareApiRequestRaw,
} from '../shared/GenericFunctions';

jest.mock('../shared/GenericFunctions', () => ({
	cloudflareApiRequest: jest.fn(),
	cloudflareApiRequestAllItems: jest.fn(),
	cloudflareApiRequestDownload: jest.fn(),
	cloudflareApiRequestRaw: jest.fn(),
}));

const mockCloudflareApiRequest = cloudflareApiRequest as jest.MockedFunction<typeof cloudflareApiRequest>;
const mockCloudflareApiRequestAllItems = cloudflareApiRequestAllItems as jest.MockedFunction<
	typeof cloudflareApiRequestAllItems
>;
const mockCloudflareApiRequestDownload = cloudflareApiRequestDownload as jest.MockedFunction<
	typeof cloudflareApiRequestDownload
>;
const mockCloudflareApiRequestRaw = cloudflareApiRequestRaw as jest.MockedFunction<
	typeof cloudflareApiRequestRaw
>;

function createExecuteContext(
	parameters: Record<string, unknown>,
	binaryBuffer: Buffer = Buffer.from(''),
	binaryData: { mimeType?: string } = {},
): IExecuteFunctions {
	return {
		getNodeParameter: jest.fn((name: string) => parameters[name]),
		helpers: {
			getBinaryDataBuffer: jest.fn(async () => binaryBuffer),
			assertBinaryData: jest.fn(() => binaryData),
			prepareBinaryData: jest.fn(async (data: Buffer, fileName: string, mimeType?: string) => ({
				data: data.toString('base64'),
				fileName,
				mimeType: mimeType ?? 'application/octet-stream',
			})),
		},
	} as unknown as IExecuteFunctions;
}

describe('r2ObjectExecute upload', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('uploads text content as raw bytes with configured headers', async () => {
		mockCloudflareApiRequestRaw.mockResolvedValueOnce({ uploaded: true });

		const context = createExecuteContext({
			operation: 'upload',
			accountId: 'acc123',
			bucketName: 'my-bucket',
			objectKey: 'folder/file.txt',
			contentSource: 'text',
			content: 'hello world',
			uploadOptions: {
				contentType: 'text/plain',
				cacheControl: 'max-age=3600',
			},
		});

		const result = await r2ObjectExecute.call(context, 0);

		expect(mockCloudflareApiRequestRaw).toHaveBeenCalledTimes(1);
		expect(mockCloudflareApiRequestRaw).toHaveBeenCalledWith(
			'PUT',
			'/accounts/acc123/r2/buckets/my-bucket/objects/folder%2Ffile.txt',
			Buffer.from('hello world', 'utf-8'),
			{
				'Content-Type': 'text/plain',
				'Cache-Control': 'max-age=3600',
			},
			0,
		);
		expect(mockCloudflareApiRequest).not.toHaveBeenCalled();
		expect(mockCloudflareApiRequestAllItems).not.toHaveBeenCalled();
		expect(result).toEqual([{ json: { uploaded: true }, pairedItem: { item: 0 } }]);
	});

	it('supports bodyMappingField extraction and escaped newline normalization', async () => {
		mockCloudflareApiRequestRaw.mockResolvedValueOnce({ uploaded: true });

		const context = createExecuteContext({
			operation: 'upload',
			accountId: 'acc123',
			bucketName: 'my-bucket',
			objectKey: 'mapped.txt',
			contentSource: 'text',
			content: '{"fileName":"mapped.txt","content":"line1\\\\nline2"}',
			uploadOptions: {
				bodyMappingField: 'content',
				contentType: 'text/plain',
			},
		});

		await r2ObjectExecute.call(context, 0);

		expect(mockCloudflareApiRequestRaw).toHaveBeenCalledWith(
			'PUT',
			'/accounts/acc123/r2/buckets/my-bucket/objects/mapped.txt',
			Buffer.from('line1\nline2', 'utf-8'),
			{ 'Content-Type': 'text/plain' },
			0,
		);
	});

	it('uploads binary content as raw bytes using detected mime type', async () => {
		const binaryBuffer = Buffer.from([1, 2, 3, 4]);
		mockCloudflareApiRequestRaw.mockResolvedValueOnce({ uploaded: true });

		const context = createExecuteContext(
			{
				operation: 'upload',
				accountId: 'acc123',
				bucketName: 'my-bucket',
				objectKey: 'binary.dat',
				contentSource: 'binary',
				binaryPropertyName: 'fileData',
				uploadOptions: {},
			},
			binaryBuffer,
			{ mimeType: 'image/png' },
		);

		await r2ObjectExecute.call(context, 0);

		expect(context.helpers.assertBinaryData).toHaveBeenCalledWith(0, 'fileData');
		expect(context.helpers.getBinaryDataBuffer).toHaveBeenCalledWith(0, 'fileData');
		expect(mockCloudflareApiRequestRaw).toHaveBeenCalledWith(
			'PUT',
			'/accounts/acc123/r2/buckets/my-bucket/objects/binary.dat',
			binaryBuffer,
			{ 'Content-Type': 'image/png' },
			0,
		);
	});

	it('falls back to application/octet-stream when binary mime type is not available', async () => {
		const binaryBuffer = Buffer.from([1, 2, 3, 4]);
		mockCloudflareApiRequestRaw.mockResolvedValueOnce({ uploaded: true });

		const context = createExecuteContext(
			{
				operation: 'upload',
				accountId: 'acc123',
				bucketName: 'my-bucket',
				objectKey: 'unknown.bin',
				contentSource: 'binary',
				binaryPropertyName: 'fileData',
				uploadOptions: {},
			},
			binaryBuffer,
			{},
		);

		await r2ObjectExecute.call(context, 0);

		expect(mockCloudflareApiRequestRaw).toHaveBeenCalledWith(
			'PUT',
			'/accounts/acc123/r2/buckets/my-bucket/objects/unknown.bin',
			binaryBuffer,
			{ 'Content-Type': 'application/octet-stream' },
			0,
		);
	});

	it('returns a fallback success payload when upload API returns no body', async () => {
		mockCloudflareApiRequestRaw.mockResolvedValueOnce(undefined as never);

		const context = createExecuteContext({
			operation: 'upload',
			accountId: 'acc123',
			bucketName: 'my-bucket',
			objectKey: 'empty-response.txt',
			contentSource: 'text',
			content: 'ok',
			uploadOptions: {},
		});

		const result = await r2ObjectExecute.call(context, 0);

		expect(mockCloudflareApiRequestRaw).toHaveBeenCalledWith(
			'PUT',
			'/accounts/acc123/r2/buckets/my-bucket/objects/empty-response.txt',
			Buffer.from('ok', 'utf-8'),
			{ 'Content-Type': 'text/plain; charset=utf-8' },
			0,
		);
		expect(result).toEqual([
			{
				json: { success: true, key: 'empty-response.txt' },
				pairedItem: { item: 0 },
			},
		]);
	});
});

describe('r2ObjectExecute get (download)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('downloads object content and returns it as text by default', async () => {
		mockCloudflareApiRequestDownload.mockResolvedValueOnce({
			body: Buffer.from('# Hello\nWorld', 'utf-8'),
			contentType: 'text/markdown',
		});

		const context = createExecuteContext({
			operation: 'get',
			accountId: 'acc123',
			bucketName: 'my-bucket',
			objectKey: 'docs/readme.md',
			responseFormat: 'text',
		});

		const result = await r2ObjectExecute.call(context, 0);

		expect(mockCloudflareApiRequestDownload).toHaveBeenCalledWith(
			'GET',
			'/accounts/acc123/r2/buckets/my-bucket/objects/docs%2Freadme.md',
			{},
			0,
		);
		expect(mockCloudflareApiRequest).not.toHaveBeenCalled();
		expect(result).toEqual([
			{
				json: {
					success: true,
					key: 'docs/readme.md',
					content: '# Hello\nWorld',
					contentType: 'text/markdown',
					size: Buffer.from('# Hello\nWorld', 'utf-8').length,
				},
				pairedItem: { item: 0 },
			},
		]);
	});

	it('returns object content as a binary property when requested', async () => {
		const fileBytes = Buffer.from([0, 1, 2, 3, 4]);
		mockCloudflareApiRequestDownload.mockResolvedValueOnce({
			body: fileBytes,
			contentType: 'application/octet-stream',
		});

		const context = createExecuteContext({
			operation: 'get',
			accountId: 'acc123',
			bucketName: 'my-bucket',
			objectKey: 'data/blob.bin',
			responseFormat: 'binary',
			binaryPropertyName: 'data',
		});

		const result = await r2ObjectExecute.call(context, 0);

		expect(context.helpers.prepareBinaryData).toHaveBeenCalledWith(
			fileBytes,
			'data/blob.bin',
			'application/octet-stream',
		);
		expect(result).toEqual([
			{
				json: {
					success: true,
					key: 'data/blob.bin',
					contentType: 'application/octet-stream',
					size: fileBytes.length,
				},
				binary: {
					data: {
						data: fileBytes.toString('base64'),
						fileName: 'data/blob.bin',
						mimeType: 'application/octet-stream',
					},
				},
				pairedItem: { item: 0 },
			},
		]);
	});
});
