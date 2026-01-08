module.exports = {
	apps: [
		{
			name: 'n8n-dev',
			script: 'C:\\Users\\admin\\AppData\\Roaming\\npm\\node_modules\\n8n\\bin\\n8n',
			args: 'start',
			exec_mode: 'fork',
			windowsHide: true,
			env: {
				// n8n custom extensions path
				N8N_CUSTOM_EXTENSIONS: `${process.env.USERPROFILE}\\.n8n\\custom`,

				// n8n owner credentials
				N8N_OWNER_EMAIL: 'test@test.test',
				N8N_OWNER_PASSWORD: '54109999',

				// Debug logging - set to 'debug' for verbose output
				N8N_LOG_LEVEL: 'debug',
				N8N_LOG_OUTPUT: 'console',

				// Development mode
				NODE_ENV: 'development',
				N8N_DEV_RELOAD: 'true',

				// Disable telemetry for cleaner logs
				N8N_DIAGNOSTICS_ENABLED: 'false',
				N8N_PERSONALIZATION_ENABLED: 'false',

				// Show detailed error information
				N8N_PAYLOAD_SIZE_MAX: '64',
				EXECUTIONS_DATA_SAVE_ON_ERROR: 'all',
				EXECUTIONS_DATA_SAVE_ON_SUCCESS: 'all',
				EXECUTIONS_DATA_SAVE_ON_PROGRESS: 'true',
				EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS: 'true',

				// Node.js debug options
				NODE_OPTIONS: '--trace-warnings',
			},
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '6G',
			// Log files for debugging
			error_file: `${process.env.USERPROFILE}\\.n8n\\logs\\n8n-error.log`,
			out_file: `${process.env.USERPROFILE}\\.n8n\\logs\\n8n-out.log`,
			merge_logs: true,
			log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
		},
	],
};
