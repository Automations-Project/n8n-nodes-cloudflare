import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function pagesProjectExecute(
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
				`/accounts/${accountId}/pages/projects`,
			);
		} else {
			const limit = this.getNodeParameter('limit', itemIndex) as number;
			const qs: IDataObject = { per_page: limit };
			responseData = await cloudflareApiRequest.call(
				this,
				'GET',
				`/accounts/${accountId}/pages/projects`,
				{},
				qs,
			);
		}
	}

	if (operation === 'get') {
		const projectName = this.getNodeParameter('projectName', itemIndex) as string;

		responseData = await cloudflareApiRequest.call(
			this,
			'GET',
			`/accounts/${accountId}/pages/projects/${projectName}`,
		);
	}

	if (operation === 'create') {
		const projectName = this.getNodeParameter('projectName', itemIndex) as string;
		const productionBranch = this.getNodeParameter('productionBranch', itemIndex) as string;
		const projectOptions = this.getNodeParameter('projectOptions', itemIndex) as {
			buildCommand?: string;
			destinationDir?: string;
			rootDir?: string;
		};

		const body: IDataObject = {
			name: projectName,
			production_branch: productionBranch,
		};

		// Build configuration
		const buildConfig: IDataObject = {};
		if (projectOptions.buildCommand) {
			buildConfig.build_command = projectOptions.buildCommand;
		}
		if (projectOptions.destinationDir) {
			buildConfig.destination_dir = projectOptions.destinationDir;
		}
		if (projectOptions.rootDir) {
			buildConfig.root_dir = projectOptions.rootDir;
		}

		if (Object.keys(buildConfig).length > 0) {
			body.build_config = buildConfig;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/pages/projects`,
			body,
		);
	}

	if (operation === 'delete') {
		const projectName = this.getNodeParameter('projectName', itemIndex) as string;

		await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/accounts/${accountId}/pages/projects/${projectName}`,
		);

		responseData = { success: true, deleted: projectName };
	}

	if (operation === 'update') {
		const projectName = this.getNodeParameter('projectName', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex) as {
			productionBranch?: string;
			buildCommand?: string;
			destinationDir?: string;
			rootDir?: string;
		};

		const body: IDataObject = {};

		if (updateFields.productionBranch) {
			body.production_branch = updateFields.productionBranch;
		}

		// Build configuration
		const buildConfig: IDataObject = {};
		if (updateFields.buildCommand) {
			buildConfig.build_command = updateFields.buildCommand;
		}
		if (updateFields.destinationDir) {
			buildConfig.destination_dir = updateFields.destinationDir;
		}
		if (updateFields.rootDir) {
			buildConfig.root_dir = updateFields.rootDir;
		}

		if (Object.keys(buildConfig).length > 0) {
			body.build_config = buildConfig;
		}

		responseData = await cloudflareApiRequest.call(
			this,
			'PATCH',
			`/accounts/${accountId}/pages/projects/${projectName}`,
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

