from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str
    type: str  # income / expense
    icon: str

class CategoryResponse(BaseModel):
    id: int
    name: str
    type: str
    icon: str="food"

    class Config:
        from_attributes = True
