-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Cities Table
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Areas Table
CREATE TABLE IF NOT EXISTS areas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city_id INTEGER REFERENCES cities(id),
    lat DOUBLE PRECISION,
    long DOUBLE PRECISION,
    distance_weight DOUBLE PRECISION DEFAULT 1.0, -- Used for delivery carbon calculations
    UNIQUE(name, city_id)
);

-- Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    area_id INTEGER REFERENCES areas(id),
    lat DOUBLE PRECISION,
    long DOUBLE PRECISION
);

-- Food Items Table
CREATE TABLE IF NOT EXISTS food_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    carbon_score DOUBLE PRECISION, -- e.g., kg CO2e
    price DOUBLE PRECISION,
    category VARCHAR(100),
    embedding vector(384) -- For semantic search (e.g., using all-MiniLM-L6-v2)
);

-- Indices
CREATE INDEX idx_food_items_embedding ON food_items USING ivfflat (embedding vector_cosine_ops);
