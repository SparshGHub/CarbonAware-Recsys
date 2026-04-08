# EcoRecSys: Parametric Multi-Objective Recommender System

## System Overview

EcoRecSys is a production-scale recommendation engine designed to quantify and optimize the trade-offs between commercial query relevance and true environmental sustainability. 

The system operates on a dual-model architecture, processing and presenting results through two parallel pathways:

1. **Commercial Baseline Retrieval**: A traditional semantic search engine that is absolutely unaware of carbon emissions. It identifies candidate food items purely utilizing dense vector cosine similarity against user query embeddings to maximize taste and intent relevance.
2. **Lifecycle-Aware Re-ranking System**: A multi-axis optimization function that re-evaluates the baseline candidates. It applies penalties based on a composite carbon footprint matrix, which calculates static food production emission costs alongside dynamic logistical distance overheads (computed via real-time spatial heuristics between fulfillment centers and the delivery node).

A user-tunable scalar coefficient (`Lambda` or `λ`) is exposed at the application layer to precisely govern the explicit regularization weight of the environmental lifecycle penalty against the commercial relevance scale.

## User Interface Flow

The frontend functions as an analytical interface specifically designed to explore outputs from the dual-model system:
* **Location Context Input**: Users define a precise delivery boundary (City and Area), which is passed to the backend to calculate the dynamic spatial delivery logistics required by the Lifecycle-Aware model.
* **Semantic Querying**: Users query the system using natural language food intents.
* **Side-by-Side Validation**: The interface presents the top-K recommendations from both the Commercial Baseline and the Lifecycle-Aware systems distinctly.
* **Parametric Tuning**: Users dynamically adjust the `Lambda` parameter via a slider, which issues immediate re-ranking requests to visualize how shifting the carbon penalty impacts the recommendation frontier.

## Stack Architecture

* **API Gateway & Application Logic**: FastAPI providing an asynchronous, highly concurrent REST interface.
* **Vector Execution Engine**: PostgreSQL augmented with the `pgvector` extension. The database implements Hierarchical Navigable Small World (HNSW) indexing to enable sub-millisecond approximate nearest neighbor (ANN) retrieval over embedding spaces generated via the `all-MiniLM-L6-v2` architecture.
* **Client Interface**: Built efficiently on Next.js to handle deterministic state management, asynchronous API synchronization, and result subset validation.

## Deployment Protocol

The entire application stack is containerized and orchestrated via Docker Compose, isolating the underlying services within a standardized network mesh without the need for manual dependency management.

### Bootstrapping the Cluster

To initialize the environment, compile the required images, and instantiate the persistence volumes, execute the following command from the project root:

```bash
docker compose up -d --build
```

### Service Map

Upon successful initialization of the container lifecycle, the microservices become accessible via the following local host interfaces:

* **Frontend Application**: `http://localhost:3000`
* **REST API Gateway**: `http://localhost:8000`
* **PostgreSQL Store**: `localhost:5432`

### Automated Provisioning Data Flow

During the initial deployment sequence, the API service will detect table states and automatically trigger a deterministic initialization pipeline (`api/seed.py`). This sequence handles the immediate relational schema hydration, pre-computes and inserts vector embeddings for the mock dataset, and maps the static centroid coordinates necessary for the algorithmic distance evaluations. External data ingestion or configuration is not required.
