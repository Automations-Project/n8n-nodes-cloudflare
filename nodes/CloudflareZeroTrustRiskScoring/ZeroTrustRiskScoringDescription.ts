import { INodeProperties } from 'n8n-workflow';
import { accountIdField } from '../shared/SharedFields';

export const zeroTrustRiskScoringOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['zeroTrustRiskScoring'] } },
		options: [
			{ name: 'Get User Risk', value: 'getUserRisk', description: 'Get risk score for a user', action: 'Get user risk' },
			{ name: 'Reset User Risk', value: 'resetUserRisk', description: 'Reset risk score for a user', action: 'Reset user risk' },
			{ name: 'Get Behaviors', value: 'getBehaviors', description: 'Get risk scoring behaviors', action: 'Get behaviors' },
			{ name: 'Update Behaviors', value: 'updateBehaviors', description: 'Update risk scoring behaviors', action: 'Update behaviors' },
		],
		default: 'getBehaviors',
	},
];

export const zeroTrustRiskScoringFields: INodeProperties[] = [
	{ ...accountIdField, displayOptions: { show: { resource: ['zeroTrustRiskScoring'] } } },
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['zeroTrustRiskScoring'], operation: ['getUserRisk', 'resetUserRisk'] } },
	},
	{
		displayName: 'Behaviors Config (JSON)',
		name: 'behaviorsConfig',
		type: 'json',
		default: '{}',
		displayOptions: { show: { resource: ['zeroTrustRiskScoring'], operation: ['updateBehaviors'] } },
	},
];
