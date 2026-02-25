import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function workersScriptExecute(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;
	const accountId = this.getNodeParameter('accountId', itemIndex) as string;

	let responseData: IDataObject | IDataObject[] | undefined;

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;

		if (returnAll) {
			responseData = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/workers/scripts`,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			const qs: IDataObject = { per_page: limit };
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/workers/scripts`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const scriptName = this.getNodeParameter('scriptName', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/workers/scripts/${scriptName}`,
		);
	}

	if (operation === 'delete') {
		const scriptName = this.getNodeParameter('scriptName', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/workers/scripts/${scriptName}`,
		);

		responseData = { success: true, deleted: scriptName };
	}

	if (operation === 'upload') {
		const scriptName = this.getNodeParameter('scriptName', itemIndex) as string;
		const scriptContent = this.getNodeParameter('scriptContent', itemIndex) as string;
		const uploadOptions = this.getNodeParameter('uploadOptions', itemIndex) as {
			compatibilityDate?: string;
			moduleType?: string;
		};

		const moduleType = uploadOptions.moduleType === 'sw' ? 'sw' : 'esm';
		const metadata: IDataObject = {};
		if (moduleType === 'sw') {
			metadata.body_part = 'worker.js';
		} else {
			metadata.main_module = 'worker.js';
		}

		if (uploadOptions.compatibilityDate) {
			metadata.compatibility_date = uploadOptions.compatibilityDate;
		}

		const options = {
			method: 'PUT' as const,
			url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${encodeURIComponent(scriptName)}`,
			formData: {
				metadata: {
					value: Buffer.from(JSON.stringify(metadata), 'utf-8'),
					options: {
						filename: 'metadata.json',
						contentType: 'application/json',
					},
				},
				files: {
					value: Buffer.from(scriptContent, 'utf-8'),
					options: {
						filename: 'worker.js',
						contentType: moduleType === 'sw' ? 'application/javascript' : 'application/javascript+module',
					},
				},
			},
			json: true,
		};

		try {
			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'cloudflareApi',
				options,
			);

			if (response.success === false) {
				throw new NodeApiError(this.getNode(), response as JsonObject, {
					message: response.errors?.[0]?.message || 'Unknown error',
				});
			}

			responseData = (response.result as IDataObject) ?? (response as IDataObject);
		} catch (error) {
			if (error instanceof NodeApiError) {
				throw error;
			}
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}
	}

	if (operation === 'getContent') {
		const scriptName = this.getNodeParameter('scriptName', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/workers/scripts/${scriptName}/content`,
		);
	}

	if (operation === 'getSettings') {
		const scriptName = this.getNodeParameter('scriptName', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/workers/scripts/${scriptName}/settings`,
		);
	}

	if (operation === 'updateSettings') {
		const scriptName = this.getNodeParameter('scriptName', itemIndex) as string;
		const settingsFields = this.getNodeParameter('settingsFields', itemIndex) as {
			compatibilityDate?: string;
			compatibilityFlags?: string;
			logpush?: boolean;
		};

		const body: IDataObject = {};

		if (settingsFields.compatibilityDate) {
			body.compatibility_date = settingsFields.compatibilityDate;
		}
		if (settingsFields.compatibilityFlags) {
			body.compatibility_flags = settingsFields.compatibilityFlags.split(',').map((f) => f.trim());
		}
		if (settingsFields.logpush !== undefined) {
			body.logpush = settingsFields.logpush;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/accounts/${accountId}/workers/scripts/${scriptName}/settings`,
			body,
		);
	}

	// Normalize response
	const result: IDataObject[] = Array.isArray(responseData)
		? responseData
		: responseData
			? [responseData]
			: [{ success: true }];

	return result.map((item) => ({
		json: item,
		pairedItem: { item: itemIndex },
	}));
}

