import json
import os
from pathlib import Path

import numpy as np
from dotenv import load_dotenv
from openai import OpenAI
from pypdf import PdfReader

load_dotenv()

EMBEDDING_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4o-mini"

SYSTEM_PROMPT = """
You are Vro Chat, a helpful AI assistant for Vignesh's portfolio.
Answer questions using only the provided context from Vignesh's resume.
If the requested information is not available in the context, respond with:
"I don't have that information in Vignesh's resume."
Keep your answers concise, accurate, and professional.
"""

DATA_DIR = Path(__file__).resolve().parent / "data"
RESUME_PDF = DATA_DIR / "resume.pdf"
CHUNKS_JSON = DATA_DIR / "chunks.json"
EMBEDDINGS_JSON = DATA_DIR / "embeddings.json"
QUESTIONS_VECTORS_JSON = DATA_DIR / "questionsandvectors.json"


def extract_text(pdf_path: Path = RESUME_PDF) -> str:
    """Read a PDF file and return all page text as one string."""
    reader = PdfReader(str(pdf_path))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages).strip()


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 100) -> list[dict]:
    """Split text into overlapping chunks with id and metadata."""
    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")

    step = chunk_size - overlap
    chunks = []
    start = 0
    index = 1

    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(
            {
                "chunk_id": f"chunk_{index:03d}",
                "text": text[start:end],
                "metadata": {
                    "start_char": start,
                    "end_char": end - 1,
                },
            }
        )
        if end >= len(text):
            break
        start += step
        index += 1

    return chunks


def save_json(data, file_path: Path) -> Path:
    """Save data to a JSON file. Creates parent folders if needed."""
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    return file_path


def load_json(file_path: Path):
    """Load and return data from a JSON file."""
    with open(file_path, encoding="utf-8") as f:
        return json.load(f)


def create_embeddings(
    chunks: list[dict],
    model: str = EMBEDDING_MODEL,
) -> list[dict]:
    """Convert chunk text to embedding vectors using OpenAI."""
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    texts = [chunk["text"] for chunk in chunks]

    response = client.embeddings.create(model=model, input=texts)

    embedded_chunks = []
    for chunk, item in zip(chunks, response.data):
        embedded_chunks.append(
            {
                "chunk_id": chunk["chunk_id"],
                "text": chunk["text"],
                "embedding": item.embedding,
                "metadata": chunk["metadata"],
            }
        )

    return embedded_chunks


def load_vector_json(file_path: Path = EMBEDDINGS_JSON) -> list[dict]:
    """Load saved embedding vectors from JSON (variable 'a')."""
    return load_json(file_path)


def normalize_question(question: str) -> str:
    """Normalize question text for cache lookup."""
    return " ".join(question.strip().lower().split())


def load_questions_vectors(file_path: Path = QUESTIONS_VECTORS_JSON) -> list[dict]:
    """Load cached question vectors. Returns empty list if file does not exist."""
    if not file_path.exists():
        return []
    return load_json(file_path)


def check_question_exists(question: str) -> list[float] | None:
    """Return cached vector if the same question was embedded before."""
    normalized = normalize_question(question)

    for item in load_questions_vectors():
        if item["normalized_question"] == normalized:
            return item["embedding"]

    return None


def save_question_vector(question: str, embedding: list[float]) -> Path:
    """Save a new question and its vector to the local cache."""
    cache = load_questions_vectors()
    cache.append(
        {
            "question": question.strip(),
            "normalized_question": normalize_question(question),
            "embedding": embedding,
        }
    )
    return save_json(cache, QUESTIONS_VECTORS_JSON)


def embed_question(question: str, model: str = EMBEDDING_MODEL) -> list[float]:
    """Convert a user question into an embedding vector (variable 'b')."""
    cached_vector = check_question_exists(question)
    if cached_vector is not None:
        return cached_vector

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.embeddings.create(model=model, input=question)
    vector = response.data[0].embedding

    save_question_vector(question, vector)
    return vector


def find_similar_chunks(
    question_vector: list[float],
    resume_vectors: list[dict],
    top_k: int = 3,
) -> dict:
    """Compare question vector (b) with resume vectors (a) and return best matches."""
    question = np.array(question_vector)
    question_norm = np.linalg.norm(question)

    matches = []
    for item in resume_vectors:
        chunk_vector = np.array(item["embedding"])
        chunk_norm = np.linalg.norm(chunk_vector)
        similarity = float(np.dot(question, chunk_vector) / (question_norm * chunk_norm))

        matches.append(
            {
                "chunk_id": item["chunk_id"],
                "similarity_score": similarity,
                "text": item["text"],
                "metadata": item["metadata"],
            }
        )

    matches.sort(key=lambda match: match["similarity_score"], reverse=True)
    top_matches = matches[:top_k]

    return {
        "match_count": len(top_matches),
        "matches": top_matches,
    }


def ask_gpt(question: str, matches: list[dict], model: str = CHAT_MODEL) -> dict:
    """Send question + retrieved chunks to GPT and return the answer."""
    context = "\n\n".join(match["text"] for match in matches)

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion:\n{question}",
            },
        ],
    )

    return {
        "context": context,
        "answer": response.choices[0].message.content,
    }

if __name__ == "__main__":
    question = "In which college did Vignesh study?"

    resume_vectors = load_vector_json()
    question_vector = embed_question(question)
    result = find_similar_chunks(question_vector, resume_vectors)
    gpt_result = ask_gpt(question, result["matches"])

    print(f"Question: {question}")
    print(f"Matching chunks: {result['match_count']}\n")
    print("--- Final Context (sent to GPT) ---")
    print(gpt_result["context"])
    print("--- End Context ---\n")
    print(f"Answer:\n{gpt_result['answer']}")

