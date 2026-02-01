# Contributing to n8n-nodes-cloudflare

Thank you for contributing! 🎉

## Development Setup

```bash
# Clone
git clone https://github.com/Automations-Project/n8n-nodes-cloudflare.git
cd n8n-nodes-cloudflare

# Install
npm install

# Build
npm run build
```

## Testing

We use Jest for testing.

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Test Structure

| Directory                    | Purpose               |
| ---------------------------- | --------------------- |
| `nodes/shared/*.test.ts`     | Shared utility tests  |
| `credentials/*.test.ts`      | Credential validation |
| `nodes/[NodeName]/*.test.ts` | Node-specific tests   |

### Adding Tests

1. Create `[NodeName].test.ts` alongside the node file
2. Follow the pattern in `CloudflareDns.test.ts`
3. Cover: metadata, configuration, resources, methods

## Code Style

```bash
npm run lint     # Check linting
npm run lintfix  # Auto-fix issues
npm run format   # Format with Prettier
```

## Adding a New Node

1. Create folder: `nodes/CloudflareServiceName/`
2. Add files:
   - `CloudflareServiceName.node.ts` - Main node
   - `ServiceNameDescription.ts` - Field definitions
   - `ServiceNameExecute.ts` - Execution logic
   - `CloudflareServiceName.node.json` - Codex metadata
   - `CloudflareServiceName.test.ts` - Tests
3. Register in `package.json` under `n8n.nodes`

## Pull Request Process

1. Fork and create feature branch
2. Make changes
3. Run tests: `npm test`
4. Run lint: `npm run lint`
5. Update documentation if needed
6. Submit PR with clear description

## Questions?

Open an [issue](https://github.com/Automations-Project/n8n-nodes-cloudflare/issues/new).
