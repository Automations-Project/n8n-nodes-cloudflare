import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getAccessApplications } from '../shared/SharedMethods';

import { accessApplicationOperations, accessApplicationFields } from './ZeroTrustAccessApplicationDescription';
import { gatewayOperations, gatewayFields } from './ZeroTrustGatewayDescription';
import {
	identityProviderOperations, identityProviderFields,
	accessGroupOperations, accessGroupFields,
	serviceTokenOperations, serviceTokenFields,
} from './ZeroTrustExtendedDescription';

// Merged Phase 1
import { zeroTrustConnectivityOperations, zeroTrustConnectivityFields } from '../CloudflareZeroTrustConnectivity/ZeroTrustConnectivityDescription';
import { zeroTrustRiskScoringOperations, zeroTrustRiskScoringFields } from '../CloudflareZeroTrustRiskScoring/ZeroTrustRiskScoringDescription';

// Merged Phase 2
import { devicesOperations, devicesFields } from '../CloudflareDevices/DevicesDescription';
import { dexOperations, dexFields } from '../CloudflareDex/DexDescription';
import { tunnelsOperations, tunnelsFields } from '../CloudflareTunnels/TunnelsDescription';
import { warpConnectorOperations, warpConnectorFields } from '../CloudflareWarpConnector/WarpConnectorDescription';
import { teamnetOperations, teamnetFields } from '../CloudflareTeamnet/TeamnetDescription';

import { accessApplicationExecute } from './ZeroTrustAccessApplicationExecute';
import { gatewayExecute } from './ZeroTrustGatewayExecute';
import {
	identityProviderExecute, accessGroupExecute, serviceTokenExecute,
} from './ZeroTrustExtendedExecute';

// Merged Phase 1
import { zeroTrustConnectivityExecute } from '../CloudflareZeroTrustConnectivity/ZeroTrustConnectivityExecute';
import { zeroTrustRiskScoringExecute } from '../CloudflareZeroTrustRiskScoring/ZeroTrustRiskScoringExecute';

// Merged Phase 2
import { devicesExecute } from '../CloudflareDevices/DevicesExecute';
import { dexExecute } from '../CloudflareDex/DexExecute';
import { tunnelsExecute } from '../CloudflareTunnels/TunnelsExecute';
import { warpConnectorExecute } from '../CloudflareWarpConnector/WarpConnectorExecute';
import { teamnetExecute } from '../CloudflareTeamnet/TeamnetExecute';

export class CloudflareZeroTrust implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Zero Trust',
		name: 'cloudflareZeroTrust',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare Zero Trust (Access, Gateway, Tunnels, Devices, etc)',
		defaults: {
			name: 'Cloudflare Zero Trust',
		},
		inputs: ['main'],
		usableAsTool: true,
		outputs: ['main'],
		credentials: [
			{
				name: 'cloudflareApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.cloudflare.com/client/v4',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Access Application',
						value: 'accessApplication',
					},
					{
						name: 'Access Group',
						value: 'accessGroup',
					},
					{
						name: 'Connectivity',
						value: 'zeroTrustConnectivity',
					},
					{
						name: 'Device',
						value: 'device',
					},
					{
						name: 'DEX',
						value: 'dex',
					},
					{
						name: 'Gateway Rule',
						value: 'gatewayRule',
					},
					{
						name: 'Identity Provider',
						value: 'identityProvider',
					},
					{
						name: 'Risk Scoring',
						value: 'zeroTrustRiskScoring',
					},
					{
						name: 'Service Token',
						value: 'serviceToken',
					},
					{
						name: 'Tunnel (Cloudflared)',
						value: 'tunnel',
					},
					{
						name: 'Tunnel Route (Teamnet)',
						value: 'teamnet',
					},
					{
						name: 'WARP Connector',
						value: 'warpConnector',
					},
				],
				default: 'accessApplication',
			},
			// Original Zero Trust resources
			...accessApplicationOperations,
			...accessApplicationFields,
			...accessGroupOperations,
			...accessGroupFields,
			...gatewayOperations,
			...gatewayFields,
			...identityProviderOperations,
			...identityProviderFields,
			...serviceTokenOperations,
			...serviceTokenFields,
			// Merged Phase 1
			...zeroTrustConnectivityOperations,
			...zeroTrustConnectivityFields,
			...zeroTrustRiskScoringOperations,
			...zeroTrustRiskScoringFields,
			// Merged Phase 2
			...devicesOperations,
			...devicesFields,
			...dexOperations,
			...dexFields,
			...tunnelsOperations,
			...tunnelsFields,
			...warpConnectorOperations,
			...warpConnectorFields,
			...teamnetOperations,
			...teamnetFields,
		],
	};

	methods = {
		loadOptions: {
			getAccounts,
			getAccessApplications,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'accessApplication') {
					result = await accessApplicationExecute.call(this, i);
				} else if (resource === 'accessGroup') {
					result = await accessGroupExecute.call(this, i);
				} else if (resource === 'gatewayRule') {
					result = await gatewayExecute.call(this, i);
				} else if (resource === 'identityProvider') {
					result = await identityProviderExecute.call(this, i);
				} else if (resource === 'serviceToken') {
					result = await serviceTokenExecute.call(this, i);
				} else if (resource === 'zeroTrustConnectivity') {
					result = await zeroTrustConnectivityExecute.call(this, i);
				} else if (resource === 'zeroTrustRiskScoring') {
					result = await zeroTrustRiskScoringExecute.call(this, i);
				} else if (resource === 'device') {
					result = await devicesExecute.call(this, i);
				} else if (resource === 'dex') {
					result = await dexExecute.call(this, i);
				} else if (resource === 'tunnel') {
					result = await tunnelsExecute.call(this, i);
				} else if (resource === 'warpConnector') {
					result = await warpConnectorExecute.call(this, i);
				} else if (resource === 'teamnet') {
					result = await teamnetExecute.call(this, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
