from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.transaction import Transaction
from app.core.deps import get_current_user
from app.ai.features import prepare_transaction_dataframe
from app.ai.spending_patterns import detect_spending_patterns
from app.ai.anamoly_detection import detect_anomalies
from app.ai.forecasting import forecast_next_month
from app.ai.budget import generate_budget_recommendations
from app.llm.chat import explain_insight

router = APIRouter(prefix="/ai", tags=["AI"])

@router.get("/spending-patterns")
def spending_patterns(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    transactions = (
        db.query(Transaction)
        .join(Transaction.category)
        .filter(Transaction.user_id == user.id)
        .all()
    )

    df = prepare_transaction_dataframe(transactions)
    patterns = detect_spending_patterns(df)

    return {"patterns": patterns}

@router.get("/anomalies")
def spending_anomalies(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    transactions = (
        db.query(Transaction)
        .join(Transaction.category)
        .filter(Transaction.user_id == user.id)
        .all()
    )

    df = prepare_transaction_dataframe(transactions)
    anomalies = detect_anomalies(df)

    return {"anomalies": anomalies}

@router.get("/forecast")
def monthly_forecast(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    transactions = (
        db.query(Transaction)
        .join(Transaction.category)
        .filter(Transaction.user_id == user.id)
        .all()
    )

    df = prepare_transaction_dataframe(transactions)
    forecast = forecast_next_month(df)

    return {"forecast": forecast}

@router.get("/budget")
def budget_recommendation(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    transactions = (
        db.query(Transaction)
        .join(Transaction.category)
        .filter(Transaction.user_id == user.id)
        .all()
    )

    df=prepare_transaction_dataframe(transactions)
    budget = generate_budget_recommendations(df)
    return {"budget": budget}


@router.post("/chat")
def ai_chat(payload: dict):
    question = payload.get("question")
    data = payload.get("data")

    answer = explain_insight(data, question)
    return {"answer": answer}