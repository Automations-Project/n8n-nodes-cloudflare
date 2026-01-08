import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function urlScannerExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'create') {
		const url = this.getNodeParameter('url', index) as string;
		const scanOptions = this.getNodeParameter('scanOptions', index) as IDataObject;

		const body: IDataObject = {
			url,
		};

		if (scanOptions.visibility) {
			body.visibility = scanOptions.visibility;
		}
		if (scanOptions.screenshotsResolutions) {
			body.screenshotsResolutions = scanOptions.screenshotsResolutions;
		}
		if (scanOptions.customHeaders) {
			body.customHeaders = JSON.parse(scanOptions.customHeaders as string);
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/urlscanner/scan`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const scanId = this.getNodeParameter('scanId', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/urlscanner/scan/${scanId}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', index) as boolean;

		if (returnAll) {
			const response = await cloudflareApiRequestAllItems.call(
				this,
				'GET',
				`/accounts/${accountId}/urlscanner/scans`,
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		} else {
			const limit = this.getNodeParameter('limit', index) as number;
			const response = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/urlscanner/scans`,
				{},
				{ per_page: limit },
			);
			return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
		}
	}

	return [];
}
