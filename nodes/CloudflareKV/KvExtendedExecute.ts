import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

// Metadata Execute Handler
export async function kvMetadataExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const accountId = this.getNodeParameter('accountId', index) as string;
	const namespaceId = this.getNodeParameter('metadataNamespaceId', index) as string;
	const keyName = this.getNodeParameter('metadataKeyName', index) as string;

	const response = await cloudflareApiRequest.call(
		this,
		'GET',
		`/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/metadata/${keyName}`,
	);
	return [{ json: response as IDataObject }];
}
