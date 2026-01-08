import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function d1DatabaseExecute(
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
				`/accounts/${accountId}/d1/database`,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			const qs: IDataObject = { per_page: limit };
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/d1/database`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const databaseId = this.getNodeParameter('databaseId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/d1/database/${databaseId}`,
		);
	}

	if (operation === 'create') {
		const databaseName = this.getNodeParameter('databaseName', itemIndex) as string;
		const createOptions = this.getNodeParameter('createOptions', itemIndex) as {
			primaryLocationHint?: string;
		};

		const body: IDataObject = {
			name: databaseName,
		};

		if (createOptions.primaryLocationHint) {
			body.primary_location_hint = createOptions.primaryLocationHint;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/d1/database`,
			body,
		);
	}

	if (operation === 'delete') {
		const databaseId = this.getNodeParameter('databaseId', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/d1/database/${databaseId}`,
		);

		responseData = { success: true, deleted: databaseId };
	}

	if (operation === 'update') {
		const databaseId = this.getNodeParameter('databaseId', itemIndex) as string;
		const newDatabaseName = this.getNodeParameter('newDatabaseName', itemIndex) as string;

		const body: IDataObject = {
			name: newDatabaseName,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/accounts/${accountId}/d1/database/${databaseId}`,
			body,
		);
	}

	if (operation === 'export') {
		const databaseId = this.getNodeParameter('databaseId', itemIndex) as string;
		const exportOptions = this.getNodeParameter('exportOptions', itemIndex) as {
			outputFormat?: string;
			noData?: boolean;
			noSchema?: boolean;
			tables?: string;
		};

		const body: IDataObject = {
			output_format: exportOptions.outputFormat || 'sql',
		};

		if (exportOptions.noData) {
			body.no_data = true;
		}
		if (exportOptions.noSchema) {
			body.no_schema = true;
		}
		if (exportOptions.tables) {
			body.tables = exportOptions.tables.split(',').map((t) => t.trim());
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/d1/database/${databaseId}/export`,
			body,
		);
	}

	if (operation === 'import') {
		const databaseId = this.getNodeParameter('databaseId', itemIndex) as string;
		const sqlContent = this.getNodeParameter('sqlContent', itemIndex) as string;

		const body: IDataObject = {
			sql: sqlContent,
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/d1/database/${databaseId}/import`,
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

