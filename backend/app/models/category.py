from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base
from sqlalchemy.orm import relationship

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # income / expense
    icon = Column(String, nullable=False, default="food")
    
    transactions = relationship("Transaction", back_populates="category")