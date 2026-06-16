from fastapi import Body, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from rag import (
    ask_gpt,
    embed_question,
    extract_text,
    find_similar_chunks,
    load_vector_json,
)

app = FastAPI()

# Allow React frontend (different port/domain) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://vignesh-dev.in",
        "https://www.vignesh-dev.in",
        "https://portfolio.vignesh-dev.in",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def validate_question(question: str) -> str:
    """Check question is not empty. Returns cleaned question."""
    cleaned_question = question.strip()

    if not cleaned_question:
        raise HTTPException(status_code=400, detail="Question is empty")

    return cleaned_question


def run_rag_chat(question: str) -> dict:
    question = validate_question(question)

    resume_vectors = load_vector_json()
    question_vector = embed_question(question)
    match_result = find_similar_chunks(question_vector, resume_vectors)
    gpt_result = ask_gpt(question, match_result["matches"])

    return {
        "question": question,
        "question_character_count": len(question),
        "question_vector_count": len(question_vector),
        "source_pdf_char_count": len(extract_text()),
        "chunks_count": len(resume_vectors),
        "matched_chunks_count": match_result["match_count"],
        "matched_chunks": match_result["matches"],
        "context_sent": gpt_result["context"],
        "answer": gpt_result["answer"],
    }


@app.post("/api/chat")
def chat_endpoint(question: str = Body(..., embed=True)):
    return run_rag_chat(question)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
