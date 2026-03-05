from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.category import CategoryCreate, CategoryResponse
from app.models.category import Category
from app.core.deps import get_current_user
from app.models.transaction import Transaction

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/", response_model=CategoryResponse)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    new_category = Category(
        name=category.name,
        type=category.type,
        user_id=user.id,
        icon=category.icon
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/", response_model=list[CategoryResponse])
def list_categories(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return db.query(Category).filter(Category.user_id == user.id).all()

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category: CategoryCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    db_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == user.id
    ).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db_category.name = category.name
    db_category.type = category.type
    db_category.icon = category.icon
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/{category_id}", response_model=dict)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    db_category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == user.id
    ).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    txn_count = db.query(Transaction).filter(
        Transaction.category_id == category_id
    ).count()
    if txn_count > 0:
        raise HTTPException(status_code=400, detail="Category is associated to some transactions, cannot delete. Please reassign or delete those transactions first.")

    db.delete(db_category)
    db.commit()
    return {"detail": "Category deleted"}