from sqlalchemy import Column, String, Date, Numeric, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base
import uuid
from sqlalchemy.orm import relationship



class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    category_id = Column(ForeignKey("categories.id"), nullable=False)

    amount = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(String, nullable=False)  #cash / card / online
    transaction_date = Column(Date, nullable=False)
    description = Column(String)
    is_recurring = Column(Boolean, default=False)

    category=relationship("Category", back_populates="transactions")
