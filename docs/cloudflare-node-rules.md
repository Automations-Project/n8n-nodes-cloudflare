# Cloudflare Node Development Rules

## File Structure Rules

### Node Directory Structure

```
nodes/Cloudflare{ServiceName}/
├── Cloudflare{ServiceName}.node.ts    # Main node class
├── {Resource}Description.ts            # Operations + Fields per resource
├── {Resource}Execute.ts                 # Execute handler per resource (optional)
├── {ServiceName}Execute.ts              # Combined execute if simple
├── cloudflare.svg                       # Icon file
```

### Naming Conventions

- Node class: `Cloudflare{ServiceName}` (e.g., `CloudflareAccounts`)
- Node name: `cloudflare{ServiceName}` (e.g., `cloudflareAccounts`)
- Description file: `{Resource}Description.ts`
- Execute file: `{Resource}Execute.ts` or `{ServiceName}Execute.ts`

---

## Import Rules

### Always Import Shared Fields

```typescript
import { accountIdField } from '../shared/SharedFields';
import { zoneIdField } from '../shared/SharedFields';
```

### Always Import Shared Methods

```typescript
import { getAccounts, getZones } from '../shared/SharedMethods';
```

### Always Import Generic Functions

```typescript
import { cloudflareApiRequest, cloudflareApiRequestAllItems } from '../shared/GenericFunctions';
```

---

## Operation Naming Rules

### Standard Operations (Alphabetically Ordered)

```typescript
options: [
    { name: 'Create', value: 'create', ... },
    { name: 'Delete', value: 'delete', ... },
    { name: 'Get', value: 'get', ... },
    { name: 'Get Many', value: 'getMany', ... },
    { name: 'Update', value: 'update', ... },
],
```

### Custom Operations Follow Alphabetically

- `analyze`, `disable`, `enable`, `export`, `getBulk`, `getContent`, `getEmbed`, etc.

### Action Text Rules (Sentence Case)

- ✅ CORRECT: `action: 'Create a resource'`
- ❌ WRONG: `action: 'Create A Resource'`

---

## Field Rules

### Account ID Field (Dynamic Dropdown)

```typescript
{
    ...accountIdField,
    displayOptions: {
        show: {
            resource: ['myResource'],
        },
    },
},
```

### Zone ID Field (Dynamic Dropdown with Dependency)

```typescript
{
    ...zoneIdField,
    displayOptions: {
        show: {
            resource: ['myResource'],
        },
    },
},
```

### Resource-Specific ID Fields (Dynamic Dropdown)

```typescript
{
    displayName: 'Database Name or ID',
    name: 'databaseId',
    type: 'options',
    typeOptions: {
        loadOptionsMethod: 'getDatabases',
        loadOptionsDependsOn: ['accountId'],  // CRITICAL!
    },
    required: true,
    default: '',
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
    displayOptions: { ... },
},
```

### String Fields (Only when dropdown not possible)

```typescript
{
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'my-resource-name',
    description: 'Name of the resource',
    displayOptions: { ... },
},
```

---

## Collection Fields (Optional Parameters)

### Update Fields Collection

```typescript
{
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['myResource'],
            operation: ['update'],
        },
    },
    options: [
        // Fields in ALPHABETICAL order by displayName
        { displayName: 'Description', name: 'description', ... },
        { displayName: 'Enabled', name: 'enabled', ... },
        { displayName: 'Name', name: 'name', ... },
    ],
},
```

### Create Options Collection

```typescript
{
    displayName: 'Create Options',
    name: 'createOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { ... },
    options: [ ... ],
},
```

---

## Pagination Rules

### Return All / Limit Pattern

```typescript
// Return All toggle
{
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    description: 'Whether to return all results or only up to a given limit',
    displayOptions: {
        show: {
            resource: ['myResource'],
            operation: ['getMany'],
        },
    },
},
// Limit field (shown only when returnAll is false)
{
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    description: 'Max number of results to return',
    typeOptions: {
        minValue: 1,
    },
    displayOptions: {
        show: {
            resource: ['myResource'],
            operation: ['getMany'],
            returnAll: [false],
        },
    },
},
```

### Execute Handler Pattern

```typescript
if (operation === 'getMany') {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	if (returnAll) {
		const response = await cloudflareApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/path`);
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		const response = await cloudflareApiRequest.call(this, 'GET', `/accounts/${accountId}/path`, {}, { per_page: limit });
		return this.helpers.returnJsonArray(response as unknown as IDataObject[]);
	}
}
```

---

## Execute Handler Rules

### Type Casting

```typescript
// ✅ CORRECT - use 'unknown' intermediate
return this.helpers.returnJsonArray(response as unknown as IDataObject[]);

// ❌ WRONG - direct cast
return this.helpers.returnJsonArray(response as IDataObject[]);
```

### Single Item Return

```typescript
return [{ json: response as IDataObject }];
```

### Delete Operation Return

```typescript
await cloudflareApiRequest.call(this, 'DELETE', `/path/${id}`);
return [{ json: { success: true, id } }];
```

---

## Main Node Class Rules

### Methods Object (Load Options)

```typescript
methods = {
	loadOptions: {
		getAccounts,
		getZones,
		// Add custom methods here
	},
};
```

### Properties Array Order

```typescript
properties: [
    // 1. Resource selector
    {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
            // ALPHABETICAL order
            { name: 'Resource A', value: 'resourceA' },
            { name: 'Resource B', value: 'resourceB' },
        ],
        default: 'resourceA',
    },
    // 2. Operations (spread per resource)
    ...resourceAOperations,
    ...resourceBOperations,
    // 3. Fields (spread per resource)
    ...resourceAFields,
    ...resourceBFields,
],
```

### Execute Method Pattern

```typescript
async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;

    for (let i = 0; i < items.length; i++) {
        try {
            let result: INodeExecutionData[];

            if (resource === 'resourceA' || resource === 'resourceB') {
                result = await myExecute.call(this, i);
            } else {
                throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, { itemIndex: i });
            }

            returnData.push(...result);
        } catch (error) {
            if (this.continueOnFail()) {
                returnData.push({
                    json: { error: (error as Error).message },
                    pairedItem: { item: i },
                });
                continue;
            }
            throw error;
        }
    }

    return [returnData];
}
```

---

## Common Mistakes to Avoid

### ❌ DON'T: Forget loadOptionsDependsOn

```typescript
// WRONG - dropdown won't load
{ loadOptionsMethod: 'getDatabases' }

// CORRECT
{ loadOptionsMethod: 'getDatabases', loadOptionsDependsOn: ['accountId'] }
```

### ❌ DON'T: Use string when dropdown is available

```typescript
// WRONG
{ type: 'string', name: 'databaseId', ... }

// CORRECT
{ type: 'options', loadOptionsMethod: 'getDatabases', ... }
```

### ❌ DON'T: Duplicate operations in options array

```typescript
// Check for duplicate entries before adding
```

### ❌ DON'T: Forget to update displayOptions when adding operations

```typescript
// When adding 'update' operation, ensure relevant fields show for it
operation: ['get', 'delete', 'update'],  // Add to all relevant fields
```

### ❌ DON'T: Forget to add resource to execute handler

```typescript
// When adding new resource, update the if condition:
if (resource === 'old' || resource === 'new') { ... }
```

---

## Lint Rules Reference

- **Sentence case**: Descriptions and actions must use sentence case
- **Alphabetical order**: Options arrays must be alphabetically ordered by `name`
- **Use 'ID'**: Always use uppercase 'ID' not 'Id'
- **Singular resource names**: Use 'Setting' not 'Settings' in resource options

---

## API Endpoint Patterns

### Account-scoped

```
/accounts/${accountId}/service/resource
/accounts/${accountId}/service/resource/${resourceId}
```

### Zone-scoped

```
/zones/${zoneId}/service/resource
/zones/${zoneId}/service/resource/${resourceId}
```

### User-scoped

```
/user/resource
```
