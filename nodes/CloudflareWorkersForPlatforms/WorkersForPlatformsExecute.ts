import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function workersForPlatformsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const resource = this.getNodeParameter('resource', index) as string;
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (resource === 'namespace') {
		const basePath = `/accounts/${accountId}/workers/dispatch/namespaces`;

		if (operation === 'getMany') {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		}
		if (operation === 'get') {
			const namespaceName = this.getNodeParameter('namespaceName', index) as string;
			const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${namespaceName}`);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'create') {
			const namespaceName = this.getNodeParameter('namespaceName', index) as string;
			const response = await cloudflareApiRequest.call(this, 'POST', basePath, { name: namespaceName });
			return [{ json: response as IDataObject }];
		}
		if (operation === 'delete') {
			const namespaceName = this.getNodeParameter('namespaceName', index) as string;
			await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${namespaceName}`);
			return [{ json: { success: true } }];
		}
	}

	if (resource === 'script' || resource === 'dispatchScript') {
		const dispatchNamespace = this.getNodeParameter('dispatchNamespace', index) as string;
		const encodedNamespace = encodeURIComponent(dispatchNamespace);
		const basePath = `/accounts/${accountId}/workers/dispatch/namespaces/${encodedNamespace}/scripts`;

		if (operation === 'getMany') {
			const response = await cloudflareApiRequestAllItems.call(this, 'GET', basePath);
			return this.helpers.returnJsonArray(response as IDataObject[]);
		}
		if (operation === 'get') {
			const scriptName = this.getNodeParameter('scriptName', index) as string;
			const response = await cloudflareApiRequest.call(this, 'GET', `${basePath}/${scriptName}`);
			return [{ json: response as IDataObject }];
		}
		if (operation === 'delete') {
			const scriptName = this.getNodeParameter('scriptName', index) as string;
			await cloudflareApiRequest.call(this, 'DELETE', `${basePath}/${scriptName}`);
			return [{ json: { success: true } }];
		}
		if (operation === 'upload') {
			const scriptName = this.getNodeParameter('scriptName', index) as string;
			const scriptContent = this.getNodeParameter('scriptContent', index) as string;
			const uploadOptions = this.getNodeParameter('uploadOptions', index) as {
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
				url: `https://api.cloudflare.com/client/v4${basePath}/${encodeURIComponent(scriptName)}`,
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

				return [{ json: ((response.result as IDataObject) ?? (response as IDataObject)) }];
			} catch (error) {
				if (error instanceof NodeApiError) {
					throw error;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}
	}

	return [];
}
