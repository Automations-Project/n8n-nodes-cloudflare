# Cloudflare RAG Workflow Guide

This guide shows how to build a **Retrieval Augmented Generation (RAG)** workflow using Cloudflare Workers AI and Vectorize with the existing n8n-nodes-cloudflare package.

## Overview

A RAG workflow consists of two phases:

1. **Ingestion**: Convert documents → Generate embeddings → Store in vector database
2. **Retrieval**: User query → Generate query embedding → Search vectors → Return results

## Available Nodes

| Node                      | Purpose                                                    |
| ------------------------- | ---------------------------------------------------------- |
| **Cloudflare Workers AI** | Generate text embeddings using `@cf/baai/bge-base-en-v1.5` |
| **Cloudflare Vectorize**  | Store and query vectors in Cloudflare's vector database    |

---

## 🔧 Ingestion Workflow

### Step 1: Prepare Your Documents

Use n8n's built-in nodes to get your text data:

- **Read Binary File** → Read documents from disk
- **HTTP Request** → Fetch content from APIs
- **Code Node** → Transform data into text chunks

### Step 2: Generate Embeddings (Workers AI)

Use the **Cloudflare Workers AI** node:

| Setting   | Value                                   |
| --------- | --------------------------------------- |
| Resource  | `Inference`                             |
| Operation | `Run Text Embedding`                    |
| Model     | `@cf/baai/bge-base-en-v1.5`             |
| Text      | `{{ $json.text }}` (your document text) |

**Output**: An array of embedding vectors (768 dimensions for bge-base-en-v1.5)

### Step 3: Store in Vectorize

Use the **Cloudflare Vectorize** node:

| Setting    | Value                       |
| ---------- | --------------------------- |
| Resource   | `Vector`                    |
| Operation  | `Create or Update` (upsert) |
| Index Name | Your vectorize index        |
| Vectors    | See JSON format below       |

**Vectors JSON format:**

```json
[
  {
    "id": "doc-1",
    "values": [0.1, 0.2, ...],  // From Workers AI output
    "metadata": {
      "text": "Original document text",
      "source": "my-document.pdf"
    }
  }
]
```

---

## 🔍 Retrieval Workflow

### Step 1: Get User Query Embedding

Use **Cloudflare Workers AI**:

| Setting   | Value                                 |
| --------- | ------------------------------------- |
| Resource  | `Inference`                           |
| Operation | `Run Text Embedding`                  |
| Model     | `@cf/baai/bge-base-en-v1.5`           |
| Text      | `{{ $json.query }}` (user's question) |

### Step 2: Search Vectorize

Use **Cloudflare Vectorize**:

| Setting         | Value                                         |
| --------------- | --------------------------------------------- |
| Resource        | `Vector`                                      |
| Operation       | `Query`                                       |
| Query Vector    | `{{ $json.data[0] }}` (embedding from step 1) |
| Top K           | `5` (number of results)                       |
| Return Metadata | `All` (to get the original text)              |

**Output**: Top K matching documents with similarity scores

### Step 3: Generate Response (Optional)

Use **Cloudflare Workers AI** again:

| Setting   | Value                          |
| --------- | ------------------------------ |
| Resource  | `Inference`                    |
| Operation | `Run Text Generation`          |
| Model     | `@cf/meta/llama-3-8b-instruct` |
| Prompt    | See template below             |

**Prompt template:**

```
Based on the following context, answer the user's question.

Context:
{{ $json.matches.map(m => m.metadata.text).join('\n\n') }}

Question: {{ $('Webhook').item.json.query }}

Answer:
```

---

## 📋 Complete Workflow JSON

Import this workflow template into n8n:

```json
{
	"name": "Cloudflare RAG Example",
	"nodes": [
		{
			"parameters": {
				"resource": "inference",
				"operation": "textEmbedding",
				"accountId": "={{ $credentials.accountId }}",
				"modelName": "@cf/baai/bge-base-en-v1.5",
				"embeddingText": "={{ $json.text }}"
			},
			"name": "Generate Embedding",
			"type": "n8n-nodes-cloudflare.cloudflareWorkersAi",
			"position": [450, 300]
		},
		{
			"parameters": {
				"resource": "vector",
				"operation": "query",
				"accountId": "={{ $credentials.accountId }}",
				"indexName": "my-index",
				"queryVector": "={{ JSON.stringify($json.data[0]) }}",
				"queryOptions": {
					"topK": 5,
					"returnMetadata": "all"
				}
			},
			"name": "Search Vectorize",
			"type": "n8n-nodes-cloudflare.cloudflareVectorize",
			"position": [650, 300]
		}
	]
}
```

---

## ⚠️ Limitations

### No Native LangChain Cluster Node Integration

This package provides standard n8n nodes, not LangChain "cluster nodes". This means:

- ❌ Cannot connect directly to n8n's Document Loader nodes
- ❌ Cannot plug into AI Agent's "tool" connector
- ❌ Not compatible with n8n's RAG Starter Template UI

**Why?** n8n's cluster node architecture (`NodeConnectionTypes.AiEmbedding`, `NodeConnectionTypes.AiVectorStore`) is internal to the `@n8n/nodes-langchain` package and not exposed for community nodes.

### Request Native Support

If you need full LangChain integration, please submit a feature request to n8n:

1. Go to [n8n Feature Requests](https://community.n8n.io/c/feature-requests/6)
2. Request: "Native Cloudflare Vectorize & Workers AI Vector Store nodes"
3. Reference the existing Supabase/Pinecone/Qdrant implementations

---

## 🔗 Resources

- [Cloudflare Vectorize Documentation](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Workers AI Models](https://developers.cloudflare.com/workers-ai/models/)
- [n8n LangChain Concepts](https://docs.n8n.io/advanced-ai/langchain/langchain-n8n/)
