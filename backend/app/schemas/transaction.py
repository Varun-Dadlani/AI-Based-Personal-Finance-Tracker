from pydantic import BaseModel
from datetime import date
from uuid import UUID
from .category import CategoryResponse

class TransactionCreate(BaseModel):
    category_id: int
    amount: float
    payment_method: str  # income / expense
    transaction_date: date
    description: str | None = None
    is_recurring: bool = False

class TransactionResponse(BaseModel):
    id: UUID
    category_id: int
    amount: float
    payment_method: str  # cash / card / online
    transaction_date: date
    description: str | None
    is_recurring: bool
    category: CategoryResponse

    class Config:
        from_attributes = True
