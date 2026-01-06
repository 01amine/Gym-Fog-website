from app.models.products import Product
from typing import List, Optional
from datetime import datetime


class ProductService:
    
    @staticmethod
    async def filter_products(
        title: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        brand: Optional[str] = None,
        skip: int = 0,
        limit: int = 10
    ) -> List[Product]:
        query = {}

        if title:
            query["title"] = {"$regex": f".*{title}.*", "$options": "i"}

        if category:
            query["category"] = category
        
        if brand:
            query["brand"] = {"$regex": f".*{brand}.*", "$options": "i"}

        if min_price is not None or max_price is not None:
            query["price_dzd"] = {}
            if min_price is not None:
                query["price_dzd"]["$gte"] = min_price
            if max_price is not None:
                query["price_dzd"]["$lte"] = max_price

        return await Product.find(query).sort("-created_at").skip(skip).limit(limit).to_list()
    

    @staticmethod
    async def get_product_by_id(product_id: str) -> Optional[Product]:
        return await Product.get(product_id)

    @staticmethod
    async def create_product(
        title: str,
        description: str,
        image_urls: List[str],
        category: str,
        price_dzd: float,
        stock_quantity: int = 0,
        brand: Optional[str] = None,
        sizes: Optional[List[str]] = None,
        colors: Optional[List[str]] = None,
        weight: Optional[float] = None,
    ) -> Product:
        product = Product(
            title=title,
            description=description,
            image_urls=image_urls,
            category=category,
            price_dzd=price_dzd,
            stock_quantity=stock_quantity,
            brand=brand,
            sizes=sizes or [],
            colors=colors or [],
            weight=weight,
        )
        await product.insert()
        return product

    @staticmethod
    async def get_all_products(skip: int = 0, limit: int = 10) -> List[Product]:
        return await Product.find_all().sort("-created_at").to_list()
    

    @staticmethod
    async def update_product(product_id: str, data: dict) -> Optional[Product]:
        product = await Product.get(product_id)
        if not product:
            return None
        for key, value in data.items():
            setattr(product, key, value)
        await product.save()
        return product

    @staticmethod
    async def delete_product(product_id: str) -> bool:
        product = await Product.get(product_id)
        if product:
            await product.delete()
            return True
        return False

    @staticmethod
    async def search_products_by_title(keyword: str) -> List[Product]:
        return await Product.find(Product.title.regex(f".*{keyword}.*", "i")).to_list()
    

    @staticmethod
    async def get_products_by_category(category: str) -> List[Product]:
        return await Product.find(Product.category == category).to_list()