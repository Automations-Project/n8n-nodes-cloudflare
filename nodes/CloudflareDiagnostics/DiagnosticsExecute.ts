import { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { cloudflareApiRequest } from '../shared/GenericFunctions';

export async function diagnosticsExecute(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const accountId = this.getNodeParameter('accountId', index) as string;

	if (operation === 'traceroute') {
		const targetsStr = this.getNodeParameter('targets', index) as string;
		const options = this.getNodeParameter('options', index) as IDataObject;

		const targets = targetsStr.split(',').map(s => s.trim()).filter(s => s);

		const body: IDataObject = {
			targets,
		};

		if (options.colos) {
			body.colos = (options.colos as string).split(',').map(s => s.trim()).filter(s => s);
		}
		if (options.packet_type) {
			body.options = { packet_type: options.packet_type };
		}
		if (options.port) {
			body.options = { ...(body.options as IDataObject || {}), port: options.port };
		}

		const response = await cloudflareApiRequest.call(
			this,
			'POST',
			`/accounts/${accountId}/diagnostics/traceroute`,
			body,
		);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}

	return [];
}
