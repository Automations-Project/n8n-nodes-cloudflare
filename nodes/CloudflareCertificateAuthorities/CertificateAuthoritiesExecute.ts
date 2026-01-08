import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function certificateAuthoritiesExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const zoneId = this.getNodeParameter('zoneId', index) as string;

	if (operation === 'getAssociations') {
		const response = await cloudflareApiRequest.call(this, 'GET', `/zones/${zoneId}/certificate_authorities/hostname_associations`);
		return [{ json: response as IDataObject }];
	}

	if (operation === 'updateAssociations') {
		const hostnames = this.getNodeParameter('hostnames', index, '') as string;
		const mtlsCertificateId = this.getNodeParameter('mtlsCertificateId', index, '') as string;
		const body: IDataObject = {};
		if (hostnames) body.hostnames = hostnames.split(',').map(h => h.trim());
		if (mtlsCertificateId) body.mtls_certificate_id = mtlsCertificateId;
		const response = await cloudflareApiRequest.call(this, 'PUT', `/zones/${zoneId}/certificate_authorities/hostname_associations`, body);
		return [{ json: response as IDataObject }];
	}

	return [];
}
