import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const superSlurperOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['superSlurper'] } },
		options: [
			{ name: 'Create Job', value: 'createJob', description: 'Create a migration job', action: 'Create a job' },
			{ name: 'Get Job', value: 'getJob', description: 'Get a migration job', action: 'Get a job' },
			{ name: 'Get Many Jobs', value: 'getMany', description: 'List migration jobs', action: 'List jobs' },
			{ name: 'Abort Job', value: 'abortJob', description: 'Abort a migration job', action: 'Abort a job' },
		],
		default: 'getMany',
	},
];

export const superSlurperFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['superSlurper'] } } },
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['superSlurper'], operation: ['getJob', 'abortJob'] } },
	},
	{
		displayName: 'Source Bucket',
		name: 'sourceBucket',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['superSlurper'], operation: ['createJob'] } },
	},
	{
		displayName: 'Destination Bucket',
		name: 'destinationBucket',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['superSlurper'], operation: ['createJob'] } },
	},
	{
		displayName: 'Provider',
		name: 'provider',
		type: 'options',
		options: [
			{ name: 'AWS S3', value: 'aws' },
			{ name: 'Google Cloud Storage', value: 'gcs' },
			{ name: 'Azure Blob', value: 'azure' },
		],
		default: 'aws',
		displayOptions: { show: { resource: ['superSlurper'], operation: ['createJob'] } },
	},
];
