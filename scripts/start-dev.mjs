import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';

const packageName = 'n8n-nodes-httpbin';
const projectRoot = process.cwd();
const distSource = path.join(projectRoot, 'dist');
const packageJsonSource = path.join(projectRoot, 'package.json');
const n8nCliScript = path.join(projectRoot, 'node_modules', 'n8n', 'bin', 'n8n');

const homeDir = os.homedir();
const customRoot = path.join(homeDir, '.n8n', 'custom');
const packageTarget = path.join(customRoot, packageName);

async function safeCopy(source, target, options) {
  try {
    await cp(source, target, options);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
}

async function ensureArtifacts() {
  await mkdir(customRoot, { recursive: true });
  await mkdir(packageTarget, { recursive: true });
  
  // Remove any existing node_modules to avoid conflicts
  try {
    await rm(path.join(packageTarget, 'node_modules'), { recursive: true, force: true });
  } catch {}
  
  await cp(distSource, path.join(packageTarget, 'dist'), { recursive: true, force: true });
  
  // Read package.json, remove dependencies for custom extension
  const pkg = JSON.parse(await readFile(packageJsonSource, 'utf8'));
  delete pkg.dependencies;
  delete pkg.devDependencies;
  // Keep only n8n section
  const minimalPkg = {
    name: pkg.name,
    version: pkg.version,
    n8n: pkg.n8n
  };
  await writeFile(path.join(packageTarget, 'package.json'), JSON.stringify(minimalPkg, null, 2));
}

function runN8n() {
  const child = spawn(process.execPath, [n8nCliScript, 'start'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      N8N_CUSTOM_EXTENSIONS: customRoot,
      PATH: process.env.PATH + path.delimiter + path.join(projectRoot, 'node_modules', '.bin'),
      NODE_PATH: path.join(projectRoot, 'node_modules'),
    },
    cwd: projectRoot,
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

ensureArtifacts()
  .then(runN8n)
  .catch((error) => {
    console.error('Failed to prepare n8n custom extension:', error);
    process.exit(1);
  });
