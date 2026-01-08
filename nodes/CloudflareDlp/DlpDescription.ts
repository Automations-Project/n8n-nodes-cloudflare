import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const dlpOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['dlp'] } },
		options: [
			{ name: 'Create Dataset', value: 'createDataset', description: 'Create a DLP dataset', action: 'Create a dataset' },
			{ name: 'Delete Dataset', value: 'deleteDataset', description: 'Delete a DLP dataset', action: 'Delete a dataset' },
			{ name: 'Get Dataset', value: 'getDataset', description: 'Get a DLP dataset', action: 'Get a dataset' },
			{ name: 'Get Many Datasets', value: 'listDatasets', description: 'List DLP datasets', action: 'List datasets' },
			{ name: 'Create Profile', value: 'createProfile', description: 'Create a DLP profile', action: 'Create a profile' },
			{ name: 'Delete Profile', value: 'deleteProfile', description: 'Delete a DLP profile', action: 'Delete a profile' },
			{ name: 'Get Profile', value: 'getProfile', description: 'Get a DLP profile', action: 'Get a profile' },
			{ name: 'Get Many Profiles', value: 'listProfiles', description: 'List DLP profiles', action: 'List profiles' },
		],
		default: 'listProfiles',
	},
];

export const dlpFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['dlp'] } } },
	{
		displayName: 'Dataset ID',
		name: 'datasetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dlp'], operation: ['getDataset', 'deleteDataset'] } },
	},
	{
		displayName: 'Profile ID',
		name: 'profileId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dlp'], operation: ['getProfile', 'deleteProfile'] } },
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['dlp'], operation: ['createDataset', 'createProfile'] } },
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['dlp'], operation: ['createDataset', 'createProfile'] } },
	},
];
