FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --retries 10 --timeout 120 \
        --index-url https://download.pytorch.org/whl/cpu torch==2.4.1+cpu \
    && pip install --no-cache-dir --retries 10 --timeout 120 -r requirements.txt

# Pre-download Sentence Transformer model to speed up container start
RUN python3 -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')" \
    || echo "Model predownload skipped due to transient network issue; it will download on first runtime request."

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
