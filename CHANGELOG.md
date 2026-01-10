# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1-beta.0] - 2026-01-10

### Fixed

- **API Compliance**: Fixed 75+ invalid endpoints to match Cloudflare strict API v4 spec.
- **Node Loading**: Resolved "CloudflareKv is not a constructor" error on Windows dev environment.
- **Git Config**: Fixed `.gitignore` to correctly track development scripts.
- **Paths**: Corrected API paths for Radar, CloudforceOne, and Security Center nodes.

### Added

- **New Nodes**: Added support for 115 Cloudflare services including R2, D1, Workers, AI, and Zero Trust.
- **Dev Tools**: Added `scripts/setup-dev-windows.js` for better Windows development support.
- **Testing**: Added initial Jest test setup for nodes.

### Changed

- **Architecture**: Migrated to a generated node architecture based on Cloudflare OpenAPI specs.
- **Package**: Renamed to `n8n-nodes-cloudflare` (Community Edition).
