# n8n-nodes-nodemation

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

Unlock the real power of n8n with advanced tools combined in one node.

## Features

- ✅ **n8n API Client** - Direct access to n8n's REST API
- ✅ **n8n Internal API** - Advanced internal operations
- ✅ **n8n Database Operations** - PostgreSQL direct access for advanced use cases
  - Sync executions across n8n instances
  - Advanced execution metadata management
  - User and project management
  - Role-based access control operations
- ✅ **Fully Free** - Open source MIT license

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `@automations-project/n8n-nodes-nodemation`
4. Click **Install**

### Manual Installation

```bash
npm install @automations-project/n8n-nodes-nodemation
```

## Configuration

### Credentials

The node requires **Nodemation API** credentials:

- **API URL**: Your n8n instance URL (e.g., `https://your-n8n-instance.com`)
- **API Key**: n8n API key with appropriate permissions
- **Database Connection** (for PG operations):
  - Host, Port, Database name
  - Username, Password
  - SSL options

## Operations

### PostgreSQL Operations

#### Sync Executions by Metadata
Sync execution data between n8n instances using metadata key-value pairs.

**Features:**
- Batch processing with configurable batch sizes
- Atomic or non-atomic transaction modes
- Timestamp strategy options (preserve source or use destination)
- Pagination-safe timestamp alignment
- User role management with downgrade protection
- Project and folder structure preservation
- Execution data and metadata sync

**Security Features:**
- ✅ Role downgrade protection (global:owner never downgraded)
- ✅ Privilege hierarchy enforcement
- ✅ Transaction safety with rollback support

## Use Cases

- **Multi-instance Management**: Sync data between production and staging
- **Backup & Recovery**: Copy executions for audit trails
- **Development Workflows**: Clone execution data for testing
- **Team Collaboration**: Share execution history across teams
- **Compliance**: Maintain execution records with proper metadata

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## Requirements

- **Node.js**: >= 18.0.0
- **n8n**: >= 1.0.0
- **PostgreSQL**: 12+ (for database operations)

## License

[MIT](LICENSE)

## Support

- [Issues](https://github.com/Automations-Project/n8n-nodes-nodemation/issues)
- [Documentation](https://github.com/Automations-Project/n8n-nodes-nodemation)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

**nskha**
- GitHub: [@Automations-Project](https://github.com/Automations-Project)
- Email: github-public@admins.mozmail.com