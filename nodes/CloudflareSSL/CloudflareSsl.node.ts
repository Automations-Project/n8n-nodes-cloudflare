import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { getAccounts, getZones } from '../shared/SharedMethods';

// Original SSL resources
import { sslOperations, sslFields } from './SSLDescription';
import { certificatePackOperations, certificatePackFields } from './CertificatePackDescription';
import { sslExecute } from './SSLExecute';
import { certificatePackExecute } from './CertificatePackExecute';

// Merged from CloudflareCustomCertificates
import { customCertificateOperations, customCertificateFields } from '../CloudflareCustomCertificates/CustomCertificateDescription';
import { customCertificatesExecute } from '../CloudflareCustomCertificates/CustomCertificatesExecute';

// Merged from CloudflareTotalTls
import { totalTlsOperations, totalTlsFields } from '../CloudflareTotalTls/TotalTlsDescription';
import { totalTlsExecute } from '../CloudflareTotalTls/TotalTlsExecute';

// Merged from CloudflareMtlsCertificates
import { mtlsCertOperations, mtlsCertFields } from '../CloudflareMtlsCertificates/MtlsCertificatesDescription';
import { mtlsCertExecute } from '../CloudflareMtlsCertificates/MtlsCertificatesExecute';

// Merged from CloudflareOriginCa
import { originCaOperations, originCaFields } from '../CloudflareOriginCa/OriginCaDescription';
import { originCaExecute } from '../CloudflareOriginCa/OriginCaExecute';

// Merged from CloudflareCertificateAuthorities
import { certificateAuthoritiesOperations, certificateAuthoritiesFields } from '../CloudflareCertificateAuthorities/CertificateAuthoritiesDescription';
import { certificateAuthoritiesExecute } from '../CloudflareCertificateAuthorities/CertificateAuthoritiesExecute';

export class CloudflareSsl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare SSL/TLS',
		name: 'cloudflareSsl',
		icon: 'file:cloudflare.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage Cloudflare SSL/TLS certificates, packs, Total TLS, mTLS, and Origin CA',
		defaults: {
			name: 'Cloudflare SSL/TLS',
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
						name: 'Certificate Authority',
						value: 'certificateAuthority',
					},
					{
						name: 'Certificate Pack',
						value: 'certificatePack',
					},
					{
						name: 'Custom Certificate',
						value: 'customCertificate',
					},
					{
						name: 'mTLS Certificate',
						value: 'mtlsCertificate',
					},
					{
						name: 'Origin CA Certificate',
						value: 'certificate',
					},
					{
						name: 'Total TL',
						value: 'totalTls',
					},
					{
						name: 'Universal SSL Setting',
						value: 'universalSslSettings',
					},
				],
				default: 'universalSslSettings',
			},
			// Original SSL resources
			...sslOperations,
			...certificatePackOperations,
			...sslFields,
			...certificatePackFields,
			// Merged: Custom Certificates
			...customCertificateOperations,
			...customCertificateFields,
			// Merged: Total TLS
			...totalTlsOperations,
			...totalTlsFields,
			// Merged: mTLS Certificates
			...mtlsCertOperations,
			...mtlsCertFields,
			// Merged: Origin CA
			...originCaOperations,
			...originCaFields,
			// Merged: Certificate Authorities
			...certificateAuthoritiesOperations,
			...certificateAuthoritiesFields,
		],
	};

	methods = {
		loadOptions: {
			getAccounts,
			getZones,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[];

				if (resource === 'universalSslSettings') {
					result = await sslExecute.call(this, i);
				} else if (resource === 'certificatePack') {
					result = await certificatePackExecute.call(this, i);
				} else if (resource === 'customCertificate') {
					result = await customCertificatesExecute.call(this, i);
				} else if (resource === 'totalTls') {
					result = await totalTlsExecute.call(this, i);
				} else if (resource === 'mtlsCertificate') {
					result = await mtlsCertExecute.call(this, i);
				} else if (resource === 'certificate') {
					result = await originCaExecute.call(this, i);
				} else if (resource === 'certificateAuthority') {
					result = await certificateAuthoritiesExecute.call(this, i);
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
