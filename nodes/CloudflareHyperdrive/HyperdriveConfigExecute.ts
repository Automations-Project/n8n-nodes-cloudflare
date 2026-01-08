import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function hyperdriveConfigExecute(
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
				`/accounts/${accountId}/hyperdrive/configs`,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			const qs: IDataObject = { per_page: limit };
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/hyperdrive/configs`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const configId = this.getNodeParameter('configId', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/hyperdrive/configs/${configId}`,
		);
	}

	if (operation === 'create') {
		const configName = this.getNodeParameter('configName', itemIndex) as string;
		const dbHost = this.getNodeParameter('dbHost', itemIndex) as string;
		const dbPort = this.getNodeParameter('dbPort', itemIndex) as number;
		const dbName = this.getNodeParameter('dbName', itemIndex) as string;
		const dbUser = this.getNodeParameter('dbUser', itemIndex) as string;
		const dbPassword = this.getNodeParameter('dbPassword', itemIndex) as string;
		const configOptions = this.getNodeParameter('configOptions', itemIndex) as {
			scheme?: string;
		};

		const body: IDataObject = {
			name: configName,
			origin: {
				host: dbHost,
				port: dbPort,
				database: dbName,
				user: dbUser,
				password: dbPassword,
				scheme: configOptions.scheme || 'postgres',
			},
		};

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/hyperdrive/configs`,
			body,
		);
	}

	if (operation === 'update') {
		const configId = this.getNodeParameter('configId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex) as {
			name?: string;
			host?: string;
			port?: number;
			database?: string;
			user?: string;
			password?: string;
		};

		const body: IDataObject = {};
		const origin: IDataObject = {};

		if (updateFields.name) {
			body.name = updateFields.name;
		}
		if (updateFields.host) {
			origin.host = updateFields.host;
		}
		if (updateFields.port) {
			origin.port = updateFields.port;
		}
		if (updateFields.database) {
			origin.database = updateFields.database;
		}
		if (updateFields.user) {
			origin.user = updateFields.user;
		}
		if (updateFields.password) {
			origin.password = updateFields.password;
		}

		if (Object.keys(origin).length > 0) {
			body.origin = origin;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/accounts/${accountId}/hyperdrive/configs/${configId}`,
			body,
		);
	}

	if (operation === 'delete') {
		const configId = this.getNodeParameter('configId', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/hyperdrive/configs/${configId}`,
		);

		responseData = { success: true, deleted: configId };
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
