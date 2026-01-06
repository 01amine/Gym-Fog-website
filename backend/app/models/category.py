from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import BaseModel, Field

  
class Category(Document):
    title: str
    description: str
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "categories"


class CategoryCreate(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None


class CategoryUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None