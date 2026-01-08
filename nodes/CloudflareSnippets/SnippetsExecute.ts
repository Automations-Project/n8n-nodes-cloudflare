import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';

export async function snippetExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'create') {
		const snippetName = this.getNodeParameter('snippetName', index) as string;
		const mainModule = this.getNodeParameter('mainModule', index) as string;
		const filesJson = this.getNodeParameter('filesJson', index) as string;

		const files = JSON.parse(filesJson);

		const body = {
			snippet_name: snippetName,
			main_module: mainModule,
			files,
		};

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/snippets/${snippetName}`,
			body,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'delete') {
		const snippetName = this.getNodeParameter('snippetName', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'DELETE',
			`/zones/${zoneId}/snippets/${snippetName}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'get') {
		const snippetName = this.getNodeParameter('snippetName', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/snippets/${snippetName}`,
		);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'getContent') {
		const snippetName = this.getNodeParameter('snippetName', index) as string;
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/snippets/${snippetName}/content`,
		);
		return [{ json: { content: response } }];
	}

	if (operation === 'getMany') {
		const response = await cloudflareApiRequestAllItems.call(
			this,
			'GET',
			`/zones/${zoneId}/snippets`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	return [];
}

export async function snippetRuleExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getMany') {
		const response = await cloudflareApiRequest.call(
			this,
			'GET',
			`/zones/${zoneId}/snippets/snippet_rules`,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	if (operation === 'update') {
		const rulesJson = this.getNodeParameter('rulesJson', index) as string;
		const rules = JSON.parse(rulesJson);

		const response = await cloudflareApiRequest.call(
			this,
			'PUT',
			`/zones/${zoneId}/snippets/snippet_rules`,
			{ rules },
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	return [];
}
