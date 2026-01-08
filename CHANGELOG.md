# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-beta.1] - 2025-11-25

### Fixed
- **versionId NOT NULL Constraint**: Fixed workflow upsert failing on newer n8n database schemas
  - Added `versionId` column to workflow SELECT queries (fetches from source)
  - Added `versionId` column to INSERT/UPDATE statement
  - Auto-generates UUID if `versionId` is missing from source database
  - Resolves error: `null value in column "versionId" of relation "workflow_entity" violates not-null constraint`

### Added
- **Schema Monitoring Guide**: New documentation at `docs/N8N_DATABASE_SCHEMA_MONITORING.md`
  - Key n8n entity files to monitor
  - Migration folder locations
  - Column mapping reference tables
  - Step-by-step checking guidelines
  - Common schema change patterns

## [1.0.0-beta.0] - 2025-11-03

### Added

#### PostgreSQL Operations
- **Sync Executions by Metadata**: Major feature for syncing execution data between n8n instances
  - Batch processing with configurable batch sizes
  - Atomic and non-atomic transaction modes
  - Multiple timestamp strategies (preserve source, use destination created/started/stopped)
  - `paginationSafeTimestamps` option to align all timestamps for UI consistency
  - Project and folder structure preservation
  - User role management with privilege assignment
  - Execution data and metadata full sync support

#### Security Features
- **Role Downgrade Protection**: Critical security enhancement
  - Global role hierarchy enforcement (owner > admin > member)
  - `global:owner` users are never downgraded
  - Only upgrades allowed, all downgrades silently blocked
  - Protects root users from accidental privilege loss

#### Pagination Fix
- **importBaseTime Mapping**: Revolutionary approach to execution pagination
  - Single timestamp computation for entire import batch
  - Deterministic timestamp staggering (1 second per execution)
  - Guarantees monotonic ID/timestamp ordering
  - Fixes n8n UI "Load More" button functionality
  - Zero cross-batch timing drift

#### User Experience
- User Global Role option with full privilege control
- Pagination Safe Timestamps toggle for UI consistency
- Enhanced email dropdown with project member loading
- Improved error handling with detailed context

### Fixed
- Execution pagination breaking due to ID/timestamp inversion
- n8n UI "Load More" button not loading remaining executions
- User role downgrade vulnerability (global:owner → global:admin)
- Session cache permission issues (requires logout/login after role update)
- Cross-batch timestamp drift in large imports

### Changed
- Renamed from "Mega S4" to "Nodemation"
- Updated description to reflect n8n toolset focus
- Improved package.json keywords for better discoverability
- Updated category from "Object Storage" to "Utilities"

### Dependencies
- Added `pg` ^8.13.1 for PostgreSQL operations
- Added `@types/pg` ^8.15.6 for TypeScript support
- Updated Node.js requirement to >=18.0.0

### Documentation
- Complete README overhaul with feature descriptions
- Added comprehensive security documentation
- Created pagination fix technical documentation
- Added SQL safety scripts for data management

## [0.3.3] - Previous Release

### Legacy Features
- Basic n8n API operations
- Internal API access
- Initial PostgreSQL support

---

## Upgrade Notes

### From 0.3.x to 1.0.0-beta.0

**Breaking Changes:**
- None - this is a feature addition release

**New Requirements:**
- PostgreSQL client library (`pg`) now required for PG operations
- Node.js >= 18.0.0 (previously >= 16.0.0)

**Migration:**
1. Update the node: `npm update @automations-project/n8n-nodes-nodemation`
2. No credential changes required
3. New PG operations available immediately
4. Existing workflows continue to work without modification

**Security Considerations:**
- If you use User Global Role assignment in PG operations, review the new role hierarchy protection
- Root users (`global:owner`) are now automatically protected from downgrades
- Test in dev environment before production use

---

## Future Roadmap

### Planned for v1.0.0 (stable)
- Comprehensive test suite
- Additional PostgreSQL operations (workflow sync, settings migration)
- Performance optimizations for large-scale syncs
- Enhanced audit logging

### Under Consideration
- Workflow versioning and rollback
- Automated conflict resolution strategies
- Real-time execution streaming
- Multi-region sync support
