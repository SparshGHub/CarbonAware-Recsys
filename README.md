# EcoRecSys: Parametric Multi-Objective Recommender System

## System Overview

EcoRecSys is a production-scale, multi-objective recommendation engine designed to quantify and optimize the trade-offs between commercial query relevance and environmental lifecycle footprint. 

Unlike conventional recommender architectures that optimize primarily for semantic matching, EcoRecSys introduces a parameterized lifecycle-aware re-ranking pipeline. The application processes and presents results through two parallel pathways:

1. **Commercial Baseline Retrieval**: A dense vector search layer that identifies candidate food items utilizing cosine similarity against user query embeddings.
2. **Lifecycle-Aware Re-ranking**: A multi-axis optimization function that re-evaluates the baseline candidates. It applies penalties based on a composite carbon footprint matrix, which factors in static food production emission costs and dynamic logistical overhead (computed via real-time spatial heuristics between fulfillment centers and the selected delivery node).

A user-tunable scalar coefficient (`Lambda` or `λ`) is exposed at the presentation layer to govern the explicit regularization weight of the environmental penalty against the commercial relevance score.

## Stack Architecture

* **Frontend Integration**: Next.js 14 utilizing React Server Components, styled with atomic CSS utilities (Tailwind) and orchestrated with specialized libraries for deterministic layout transitions.
* **API Gateway & Application Logic**: FastAPI providing an asynchronous, highly-concurrent REST interface.
* **Vector Execution Engine**: PostgreSQL augmented with the `pgvector` extension. The database implements Hierarchical Navigable Small World (HNSW) indexing to enable sub-millisecond approximate nearest neighbor (ANN) retrieval over embedding spaces generated via the `all-MiniLM-L6-v2` architecture.

## Deployment Protocol

The entire stack is containerized and orchestrated via Docker Compose, isolating the application layers within a deterministic network mesh.

### Bootstrapping the Cluster

To initialize the environment, compile the node and python images, and mount the required persistence volumes, execute the following command from the project root:

```bash
docker compose up -d --build
```

### Service Map

Upon successful initialization of the container lifecycle, the specific microservices are mapped to the following host ports:

* **Frontend Application**: `http://localhost:3000`
* **REST API Gateway**: `http://localhost:8000`
* **PostgreSQL Persistent Store**: `localhost:5432`

### Automated Provisioning Flow

During the initial deployment sequence, the API service will automatically trigger a deterministic seeding pipeline (`api/seed.py`). This process handles the schema hydration, pre-computes the initial vector embeddings for the item corpus, and configures the physical centroid coordinates necessary for the dynamic logistical distance evaluations. No manual data ingestion is required.
