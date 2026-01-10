const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageName = 'n8n-nodes-cloudflare';
const userProfile = process.env.USERPROFILE;

if (!userProfile) {
	console.error('USERPROFILE environment variable is not set. Cannot determine custom extensions directory.');
	process.exit(1);
}

const customRoot = path.join(userProfile, '.n8n', 'custom');
const customDir = path.join(customRoot, packageName);
const args = new Set(process.argv.slice(2));
const reloadOnly = args.has('--reload-only');
const startOnly = args.has('--start-only');
const noLogs = args.has('--no-logs');
const attachLogs = args.has('--attach-logs') || (!noLogs && !reloadOnly && !startOnly);

// Setup Junction (Symlink)
if (!reloadOnly && !startOnly) {
	console.log(`[setup] Setting up dev environment for ${packageName}...`);

	// Ensure custom root exists
	if (!fs.existsSync(customRoot)) {
		fs.mkdirSync(customRoot, { recursive: true });
	}

	// Ensure node_modules exists in custom root to prevent n8n scan errors
	const customNodeModules = path.join(customRoot, 'node_modules');
	if (!fs.existsSync(customNodeModules)) {
		fs.mkdirSync(customNodeModules, { recursive: true });
	}

	let linkCreated = false;

	if (fs.existsSync(customDir)) {
		const stats = fs.lstatSync(customDir);
		if (stats.isSymbolicLink()) {
			// It's a symlink, check where it points
			const realPath = fs.realpathSync(customDir);
			if (realPath.toLowerCase() === process.cwd().toLowerCase()) {
				console.log('[setup] Link already exists and is correct.');
				linkCreated = true;
			} else {
				console.log(`[setup] Link exists but points to ${realPath}. Updating...`);
				fs.unlinkSync(customDir);
			}
		} else {
			// It's a directory (likely from previous copy implementation)
			console.log('[setup] Found existing directory. Removing to replace with link...');
			fs.rmSync(customDir, { recursive: true, force: true });
		}
	}

	if (!linkCreated) {
		console.log(`[setup] Creating junction: ${customDir} <==> ${process.cwd()}`);
		try {
			// 'junction' type is required for Windows directory symlinks without Admin privileges (usually)
			fs.symlinkSync(process.cwd(), customDir, 'junction');
			console.log('[setup] Junction created successfully.');
		} catch (error) {
			console.error('[setup] Failed to create junction:', error.message);
			console.error('You may need to run this script as Administrator or enable Developer Mode in Windows.');
			process.exit(1);
		}
	}
}

const env = {
	...process.env,
	N8N_CUSTOM_EXTENSIONS: customRoot,
	N8N_LOG_LEVEL: 'debug',
	N8N_LOG_OUTPUT: 'console',
	N8N_DEV_RELOAD: true,
	NODE_ENV: 'development',
};

const startPm2 = () => {
	const ecosystemPath = path.join(process.cwd(), 'ecosystem.config.js');
	if (fs.existsSync(ecosystemPath)) {
		execSync('pm2 start -f ecosystem.config.js --only n8n-dev', { stdio: 'inherit', env });
	} else {
		console.warn('[setup] ecosystem.config.js not found, starting n8n directly with PM2');
		// Robust Windows start: run cmd.exe and pass `n8n start` as arguments.
		const cmdExe = process.env.ComSpec || 'C:\\Windows\\System32\\cmd.exe';
		execSync(`pm2 start -f "${cmdExe}" --name n8n-dev -- /c n8n start`, { stdio: 'inherit', env });
	}
};

const reloadPm2 = () => {
	try {
		// Force restart instead of reload to clear all caches
		console.log('[setup] Restarting n8n-dev to clear caches...');
		execSync('pm2 restart n8n-dev --update-env', { stdio: 'inherit', env });
	} catch (error) {
		console.warn('pm2 restart failed, attempting to start n8n-dev instead.');
		startPm2();
	}
};

if (reloadOnly) {
	reloadPm2();
	if (attachLogs) {
		execSync('pm2 logs n8n-dev', { stdio: 'inherit', env });
	}
	process.exit(0);
}

if (startOnly) {
	startPm2();
	if (attachLogs) {
		execSync('pm2 logs n8n-dev', { stdio: 'inherit', env });
	}
	process.exit(0);
}

try {
	execSync('pm2 delete n8n-dev', { stdio: 'ignore', env });
} catch (error) {
	// Ignore if process does not exist
}

startPm2();

if (attachLogs) {
	execSync('pm2 logs n8n-dev', { stdio: 'inherit', env });
}
