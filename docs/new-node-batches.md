# New Node Implementation Batches

This document organizes the completely missing Cloudflare services into implementation batches.

---

## Quick Reference: Rules

**Before implementing ANY node, review:** [cloudflare-node-rules.md](./cloudflare-node-rules.md)

### Key Reminders

1. ✅ Use `accountIdField` or `zoneIdField` from SharedFields
2. ✅ Use `loadOptionsDependsOn: ['accountId']` for dependent dropdowns
3. ✅ Operations in ALPHABETICAL order
4. ✅ Use `returnAll/limit` pattern for getMany
5. ✅ Type cast arrays as `response as unknown as IDataObject[]`
6. ✅ Add new shared methods to SharedMethods.ts when needed
7. ✅ Register node in package.json `n8n.nodes` array

---

## Batch 1: Account Management (Foundation)

Priority: **HIGH** - Required for other nodes

### 1. CloudflareAccounts

- **API**: `/accounts`, `/accounts/{id}`
- **Resources**: Account, Member, Role
- **Operations**: get, getMany, update | create, delete, get, getMany | getMany
- **Dependencies**: None (top-level)
- **Notes**: Add `getMembers`, `getRoles` to SharedMethods

### 2. CloudflareUser

- **API**: `/user`, `/user/tokens`
- **Resources**: User, Token
- **Operations**: get, update | create, delete, get, getMany, verify, roll
- **Dependencies**: None (user-scoped)

---

## Batch 2: Security & WAF (High Value)

Priority: **HIGH** - Critical for security workflows

### 3. CloudflareRulesets

- **API**: `/zones/{zone_id}/rulesets`, `/accounts/{id}/rulesets`
- **Resources**: Ruleset, Rule
- **Operations**: create, delete, get, getMany, update | create, delete, getMany, update
- **Scope**: Both zone and account level
- **Notes**: Complex rule format, use JSON type for rules

### 4. CloudflareWaf

- **API**: `/zones/{zone_id}/firewall/waf/*`
- **Resources**: Package, Group, Rule
- **Operations**: getMany, update
- **Notes**: WAF packages and overrides

---

## Batch 3: Networking (High Value)

Priority: **HIGH** - Common enterprise features

### 5. CloudflareArgo

- **API**: `/zones/{zone_id}/argo/*`
- **Resources**: SmartRouting, TieredCaching
- **Operations**: get, update
- **Notes**: Simple toggle settings

### 6. CloudflareSpectrum

- **API**: `/zones/{zone_id}/spectrum/apps`
- **Resources**: App
- **Operations**: create, delete, get, getMany, update
- **Notes**: TCP/UDP app proxying

### 7. CloudflareHealthchecks

- **API**: `/zones/{zone_id}/healthchecks`
- **Resources**: Healthcheck
- **Operations**: create, delete, get, getMany, update
- **Notes**: Different from LB monitors

---

## Batch 4: Content & Media (Medium Value)

### 8. CloudflareWaitingRooms

- **API**: `/zones/{zone_id}/waiting_rooms`
- **Resources**: WaitingRoom, Event, Rule
- **Operations**: create, delete, get, getMany, update
- **Notes**: Queue management for high-traffic

### 9. CloudflareZaraz

- **API**: `/zones/{zone_id}/zaraz/*`
- **Resources**: Config, Tool, Trigger
- **Operations**: get, getMany, update
- **Notes**: Third-party tool management

### 10. CloudflareWeb3

- **API**: `/zones/{zone_id}/web3/hostnames`
- **Resources**: Hostname
- **Operations**: create, delete, get, getMany, update
- **Notes**: IPFS/Ethereum gateway

---

## Batch 5: Observability & Analytics

### 11. CloudflareAuditLogs

- **API**: `/accounts/{id}/audit_logs`
- **Resources**: Log
- **Operations**: getMany (with filters)
- **Notes**: Read-only, extensive filtering

### 12. CloudflareAlerting

- **API**: `/accounts/{id}/alerting/*`
- **Resources**: Policy, Destination
- **Operations**: create, delete, get, getMany, update
- **Notes**: Notification management

### 13. CloudflareUrlScanner

- **API**: `/accounts/{id}/urlscanner`
- **Resources**: Scan
- **Operations**: create, get, getMany
- **Notes**: URL malware scanning

---

## Batch 6: Certificates & Hostnames

### 14. CloudflareOriginCa

- **API**: `/certificates`
- **Resources**: Certificate
- **Operations**: create, delete, get, getMany, revoke
- **Notes**: Origin CA certificates

### 15. CloudflareCustomHostnames

- **API**: `/zones/{zone_id}/custom_hostnames`
- **Resources**: Hostname
- **Operations**: create, delete, get, getMany, update
- **Notes**: SSL for SaaS

### 16. CloudflareClientCertificates

- **API**: `/zones/{zone_id}/client_certificates`
- **Resources**: Certificate
- **Operations**: create, delete, get, getMany, update
- **Notes**: mTLS certificates

---

## Batch 7: Specialized Services

### 17. CloudflareDiagnostics

- **API**: `/accounts/{id}/diagnostics/traceroute`
- **Resources**: Traceroute
- **Operations**: create (run traceroute)
- **Notes**: Network diagnostics

### 18. CloudflareSpeed

- **API**: `/zones/{zone_id}/speed_api/*`
- **Resources**: Test, Schedule
- **Operations**: create, get, getMany, delete
- **Notes**: Performance testing

### 19. CloudflareBotManagement

- **API**: `/zones/{zone_id}/bot_management`
- **Resources**: Config
- **Operations**: get, update
- **Notes**: Bot detection settings

---

## Implementation Checklist Per Node

```markdown
## Node: Cloudflare{Name}

### Pre-Implementation

- [ ] Review cloudflare-node-rules.md
- [ ] Check Cloudflare API docs for endpoints
- [ ] Identify resources and operations
- [ ] Check if shared methods needed

### Files to Create

- [ ] `nodes/Cloudflare{Name}/Cloudflare{Name}.node.ts`
- [ ] `nodes/Cloudflare{Name}/{Resource}Description.ts`
- [ ] `nodes/Cloudflare{Name}/{Name}Execute.ts`
- [ ] `nodes/Cloudflare{Name}/cloudflare.svg` (copy from existing)

### Registration

- [ ] Add to `package.json` → `n8n.nodes` array
- [ ] Add to `package.json` → `n8n.credentials` if new creds

### Verification

- [ ] `npm run build` passes
- [ ] `npm run lint` passes (or minor issues)
```

---

## Current Progress

| Batch | Status     | Nodes                                  |
| ----- | ---------- | -------------------------------------- |
| 1     | ⬜ Pending | Accounts, User                         |
| 2     | ⬜ Pending | Rulesets, WAF                          |
| 3     | ⬜ Pending | Argo, Spectrum, Healthchecks           |
| 4     | ⬜ Pending | WaitingRooms, Zaraz, Web3              |
| 5     | ⬜ Pending | AuditLogs, Alerting, UrlScanner        |
| 6     | ⬜ Pending | OriginCa, CustomHostnames, ClientCerts |
| 7     | ⬜ Pending | Diagnostics, Speed, BotManagement      |

---

## Estimated Effort

- **Batch 1-2**: ~2-3 hours (foundation + security)
- **Batch 3-4**: ~2-3 hours (networking + content)
- **Batch 5-6**: ~2-3 hours (observability + certs)
- **Batch 7**: ~1-2 hours (specialized)

**Total**: ~8-12 hours for all batches
