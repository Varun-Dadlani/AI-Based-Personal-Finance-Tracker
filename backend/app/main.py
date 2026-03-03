from fastapi import FastAPI
from app.routes import auth,category,transaction,recurring_transactions,ai
from starlette.middleware.cors import CORSMiddleware
app = FastAPI(
    title="AI Finance Tracker API",
    description="Backend for AI-integrated finance tracker",
    version="1.0.0"
)

origin = "http://localhost:3000"
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(category.router)
app.include_router(transaction.router)
app.include_router(recurring_transactions.router)
app.include_router(ai.router)

@app.get("/health")
def health_check():
    return {"status": "OK"}

