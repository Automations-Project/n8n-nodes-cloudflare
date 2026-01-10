const chokidar = require('chokidar');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DIST_GLOB = path.join(process.cwd(), 'dist');
const ASSETS_GLOB = [
  path.join(process.cwd(), 'nodes', '**', '*.{png,svg}'),
  path.join(process.cwd(), 'credentials', '**', '*.{png,svg}')
];

let reloadPending = false;
let assetsPending = false;
let distReady = false;
let assetsReady = false;

const runReload = () => {
  if (reloadPending) return;
  reloadPending = true;

  const child = spawn(process.execPath, [path.join(__dirname, 'setup-dev-windows.js'), '--reload-only', '--no-logs'], {
    stdio: 'inherit',
  });

  child.on('exit', () => {
    reloadPending = false;
  });
};

const runGulpIcons = () => {
  if (assetsPending) return;
  assetsPending = true;

  console.log('[watch-n8n] Asset change detected. Running gulp build:icons...');
  
  try {
    execSync('npx gulp build:icons', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('[watch-n8n] Icons copied to dist/. Triggering n8n reload...');
    runReload();
  } catch (error) {
    console.error('[watch-n8n] Gulp build:icons failed:', error.message);
  } finally {
    assetsPending = false;
  }
};

// Watch dist/ for compiled TS changes
const distWatcher = chokidar.watch(DIST_GLOB, {
  ignoreInitial: true,
  persistent: true,
  ignored: ['**/*.{png,svg}'] // Assets handled separately
});

distWatcher
  .on('ready', () => {
    distReady = true;
    console.log('[watch-n8n] Watching dist/ for code changes...');
  })
  .on('all', (event, filePath) => {
    if (!distReady) return;
    console.log(`[watch-n8n] ${event} detected at ${filePath}. Reloading n8n...`);
    runReload();
  })
  .on('error', (error) => {
    console.error('[watch-n8n] dist watcher error:', error);
  });

// Watch assets (SVG, PNG) in source directories
const assetsWatcher = chokidar.watch(ASSETS_GLOB, {
  ignoreInitial: true,
  persistent: true,
});

assetsWatcher
  .on('ready', () => {
    assetsReady = true;
    console.log('[watch-n8n] Watching nodes/ and credentials/ for asset changes...');
  })
  .on('all', (event, filePath) => {
    if (!assetsReady) return;
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`[watch-n8n] Asset ${event}: ${relativePath}`);
    runGulpIcons();
  })
  .on('error', (error) => {
    console.error('[watch-n8n] assets watcher error:', error);
  });
