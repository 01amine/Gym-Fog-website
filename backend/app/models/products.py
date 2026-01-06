from typing import List, Optional
import datetime
from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field


class Product(Document):
    title: str
    description: Optional[str] = None
    image_urls: List[str] = []
    category: str     
    price_dzd: float
    stock_quantity: int = 0
    brand: Optional[str] = None
    sizes: Optional[List[str]] = []
    colors: Optional[List[str]] = []
    weight: Optional[float] = None
    created_at: datetime.datetime = Field(default_factory=lambda: datetime.datetime.now())
     
    
    class Settings:
        name = "products"


class ProductCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    price_dzd: float
    stock_quantity: int = 0
    brand: Optional[str] = None
    sizes: Optional[List[str]] = []
    colors: Optional[List[str]] = []
    weight: Optional[float] = None


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price_dzd: Optional[float] = None
    stock_quantity: Optional[int] = None
    brand: Optional[str] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    weight: Optional[float] = None
    