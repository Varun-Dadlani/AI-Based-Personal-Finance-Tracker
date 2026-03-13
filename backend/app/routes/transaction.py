from fastapi import APIRouter, Depends, HTTPException,Query
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date
from app.database import get_db
from app.models.transaction import Transaction
from app.models.category import Category
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.core.deps import get_current_user
import csv
from io import StringIO
from starlette.responses import StreamingResponse
from fastapi import UploadFile, File
from PIL import Image
import pytesseract
import re
from datetime import datetime
import fitz  # PyMuPDF
import io
from dateutil import parser
from datetime import datetime
import cv2
import numpy as np


router = APIRouter(prefix="/transactions", tags=["Transactions"])



@router.post("/", response_model=TransactionResponse)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    new_txn = Transaction(
        user_id=user.id,
        category_id=transaction.category_id,
        amount=transaction.amount,
        payment_method=transaction.payment_method,
        transaction_date=transaction.transaction_date,
        description=transaction.description,
        is_recurring=transaction.is_recurring
    )

    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)
    return new_txn



@router.get("/", response_model=list[TransactionResponse])
def list_transactions(
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
    category_id: int | None = Query(None),
    payment_method: str | None = Query(None),
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    query = db.query(Transaction).join(Category).filter(
        Transaction.user_id == user.id
    )
    if start_date:
        query = query.filter(Transaction.transaction_date >= start_date)
    if end_date:
        query = query.filter(Transaction.transaction_date <= end_date)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if payment_method:
        query = query.filter(Transaction.payment_method == payment_method)
    
    return query.order_by(Transaction.transaction_date.desc()).all()


    
  

@router.delete("/{transaction_id}", status_code=204)
def delete_transaction(    
    transaction_id: UUID,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    txn = (
        db.query(Transaction)
        .filter(Transaction.id == transaction_id, Transaction.user_id == user.id)
        .first()
    )
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(txn)
    db.commit()
    return

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: UUID,
    updated: TransactionCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    txn = (
        db.query(Transaction)
        .filter(Transaction.id == transaction_id, Transaction.user_id == user.id)
        .first()
    )

    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for field, value in updated.dict().items():
        setattr(txn, field, value)

    db.commit()
    db.refresh(txn)
    return txn

@router.get("/export/csv")
def export_transactions_csv(
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
    category_id: int | None = Query(None),
    payment_method: str | None = Query(None),
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    query = db.query(Transaction).join(Category).filter(
        Transaction.user_id == user.id
    )

    if start_date:
        query = query.filter(Transaction.transaction_date >= start_date)
    if end_date:
        query = query.filter(Transaction.transaction_date <= end_date)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if payment_method:
        query = query.filter(Transaction.payment_method == payment_method)

    output = StringIO()
    writer = csv.writer(output)

    # CSV Header
    writer.writerow([
        "Date",
        "Category",
        "Category Type",
        "Amount",
        "Payment Method",
        "Description"
    ])

    for tx in query.all():
        writer.writerow([
            tx.transaction_date.strftime("%Y-%m-%d"),
            tx.category.name,
            tx.category.type,
            tx.amount,
            tx.payment_method,
            tx.description or ""
        ])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=transactions.csv"
        }
    )

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

@router.post("/ocr")
def upload_bill(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    text = ""

    # ---------- READ FILE ----------
    if file.content_type == "application/pdf":
        pdf_bytes = file.file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text()
    else:
        image = Image.open(file.file)
        text = pytesseract.image_to_string(image)

    lines = [l.strip() for l in text.split("\n") if l.strip()]
    text_lower = text.lower()

    # ---------- PAYMENT METHOD ----------
    payment_method = None
    if any(k in text_lower for k in ["upi", "gpay", "phonepe", "paytm"]):
        payment_method = "upi"
    elif any(k in text_lower for k in ["credit", "debit", "card", "visa", "mastercard"]):
        payment_method = "card"
    elif "cash" in text_lower:
        payment_method = "cash"

    if payment_method not in {"cash", "card", "upi", "bank_transfer"}:
        payment_method = None

    # ---------- AMOUNT EXTRACTION ----------
    amount = None

    for line in lines:
        if any(k in line.lower() for k in ["total", "amount", "payable", "grand total","fees","fee",'payment']):
            nums = re.findall(r"\d+(?:\.\d+)?", line)
            if nums:
                amount = float(nums[-1])
                break

    # ---------- DATE EXTRACTION ----------
    extracted_date = None
    date_match = re.search(
        r"(\d{2}[-/]\d{2}[-/]\d{4})", text
    )

    if date_match:
        for fmt in ("%d-%m-%Y", "%d/%m/%Y"):
            try:
                extracted_date = datetime.strptime(date_match.group(1), fmt).date()
                break
            except:
                pass

    # ---------- CATEGORY EXTRACTION ----------
    user_categories = db.query(Category).filter(
        Category.user_id == user.id
    ).all()

    suggested_category = None

    for line in lines:
        for cat in user_categories:
            if cat.name.lower() in line.lower():
                suggested_category = {
                    "id": cat.id,
                    "name": cat.name
                }
                break
        if suggested_category:
            break

    # ---------- RESPONSE ----------
    return {
        "amount": round(amount, 2) if amount else None,
        "date": extracted_date.isoformat() if extracted_date else None,
        "payment_method": payment_method,
        "category": suggested_category,
        "raw_text": text[:400]
    }


