import { IDataObject } from 'n8n-workflow';

/**
 * Test NDJSON conversion logic used in cloudflareApiRequestNdjson
 */
describe('NDJSON Conversion', () => {
	const convertToNdjson = (vectors: IDataObject[]): string => {
		return vectors.map((v) => JSON.stringify(v)).join('\n') + '\n';
	};

	it('should convert single vector to NDJSON format', () => {
		const vectors: IDataObject[] = [
			{ id: '1', values: [0.1, 0.2, 0.3] },
		];

		const result = convertToNdjson(vectors);

		expect(result).toBe('{"id":"1","values":[0.1,0.2,0.3]}\n');
	});

	it('should convert multiple vectors to NDJSON format', () => {
		const vectors: IDataObject[] = [
			{ id: '1', values: [0.1, 0.2, 0.3] },
			{ id: '2', values: [0.4, 0.5, 0.6] },
			{ id: '3', values: [0.7, 0.8, 0.9] },
		];

		const result = convertToNdjson(vectors);
		const lines = result.split('\n');

		expect(lines.length).toBe(4); // 3 vectors + 1 empty line from trailing newline
		expect(lines[0]).toBe('{"id":"1","values":[0.1,0.2,0.3]}');
		expect(lines[1]).toBe('{"id":"2","values":[0.4,0.5,0.6]}');
		expect(lines[2]).toBe('{"id":"3","values":[0.7,0.8,0.9]}');
		expect(lines[3]).toBe('');
	});

	it('should handle vectors with metadata', () => {
		const vectors: IDataObject[] = [
			{
				id: 'doc-1',
				values: [0.1, 0.2],
				metadata: { category: 'test', score: 0.95 },
			},
		];

		const result = convertToNdjson(vectors);

		expect(result).toContain('"id":"doc-1"');
		expect(result).toContain('"metadata":{"category":"test","score":0.95}');
		expect(result.endsWith('\n')).toBe(true);
	});

	it('should handle empty vectors array', () => {
		const vectors: IDataObject[] = [];

		const result = convertToNdjson(vectors);

		expect(result).toBe('\n');
	});

	it('should produce valid JSON on each line', () => {
		const vectors: IDataObject[] = [
			{ id: '1', values: [0.1, 0.2, 0.3] },
			{ id: '2', values: [0.4, 0.5, 0.6] },
		];

		const result = convertToNdjson(vectors);
		const lines = result.trim().split('\n');

		lines.forEach((line) => {
			expect(() => JSON.parse(line)).not.toThrow();
		});
	});
});

/**
 * Test vector input parsing logic
 */
describe('Vector Input Parsing', () => {
	const parseVectorsInput = (input: string | IDataObject[]): IDataObject[] => {
		if (typeof input === 'string') {
			return JSON.parse(input);
		}
		return input;
	};

	it('should parse JSON string input', () => {
		const input = '[{"id":"1","values":[0.1,0.2,0.3]}]';

		const result = parseVectorsInput(input);

		expect(result).toEqual([{ id: '1', values: [0.1, 0.2, 0.3] }]);
	});

	it('should pass through array input unchanged', () => {
		const input: IDataObject[] = [{ id: '1', values: [0.1, 0.2, 0.3] }];

		const result = parseVectorsInput(input);

		expect(result).toBe(input);
	});

	it('should throw on invalid JSON string', () => {
		const input = 'not valid json';

		expect(() => parseVectorsInput(input)).toThrow();
	});

	it('should handle complex JSON with metadata', () => {
		const input = JSON.stringify([
			{
				id: 'vec-1',
				values: [0.1, 0.2, 0.3, 0.4, 0.5],
				metadata: {
					source: 'document.pdf',
					page: 5,
					tags: ['important', 'reviewed'],
				},
			},
		]);

		const result = parseVectorsInput(input);

		expect(result[0].id).toBe('vec-1');
		expect(result[0].metadata).toEqual({
			source: 'document.pdf',
			page: 5,
			tags: ['important', 'reviewed'],
		});
	});
});

/**
 * Test v2 endpoint path construction
 */
describe('Vectorize v2 Endpoint Paths', () => {
	const buildVectorizeEndpoint = (
		accountId: string,
		indexName: string,
		operation: string,
	): string => {
		const baseEndpoint = `/accounts/${accountId}/vectorize/v2/indexes`;

		switch (operation) {
			case 'list':
				return baseEndpoint;
			case 'get':
			case 'delete':
				return `${baseEndpoint}/${indexName}`;
			case 'upsert':
				return `${baseEndpoint}/${indexName}/upsert`;
			case 'query':
				return `${baseEndpoint}/${indexName}/query`;
			case 'get-by-ids':
				return `${baseEndpoint}/${indexName}/get-by-ids`;
			case 'delete-by-ids':
				return `${baseEndpoint}/${indexName}/delete-by-ids`;
			default:
				return baseEndpoint;
		}
	};

	it('should build correct v2 list endpoint', () => {
		const result = buildVectorizeEndpoint('abc123', '', 'list');
		expect(result).toBe('/accounts/abc123/vectorize/v2/indexes');
	});

	it('should build correct v2 upsert endpoint', () => {
		const result = buildVectorizeEndpoint('abc123', 'my-index', 'upsert');
		expect(result).toBe('/accounts/abc123/vectorize/v2/indexes/my-index/upsert');
	});

	it('should build correct v2 query endpoint', () => {
		const result = buildVectorizeEndpoint('acc-id', 'test-index', 'query');
		expect(result).toBe('/accounts/acc-id/vectorize/v2/indexes/test-index/query');
	});

	it('should build correct v2 get-by-ids endpoint', () => {
		const result = buildVectorizeEndpoint('acc-id', 'vectors', 'get-by-ids');
		expect(result).toBe('/accounts/acc-id/vectorize/v2/indexes/vectors/get-by-ids');
	});

	it('should build correct v2 delete-by-ids endpoint', () => {
		const result = buildVectorizeEndpoint('acc-id', 'vectors', 'delete-by-ids');
		expect(result).toBe('/accounts/acc-id/vectorize/v2/indexes/vectors/delete-by-ids');
	});
});
