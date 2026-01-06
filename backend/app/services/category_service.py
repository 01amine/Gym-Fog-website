from app.models.category import Category, CategoryCreate, CategoryUpdate
from typing import List, Optional


class CategoryService:
    
    @staticmethod
    async def create_category(title: str, description: str, image_url: Optional[str] = None) -> Category:
        category = Category(
            title=title,
            description=description,
            image_url=image_url
        )
        await category.insert()
        return category
    
    @staticmethod
    async def get_all_categories() -> List[Category]:
        return await Category.find_all().to_list()
    
    @staticmethod
    async def get_category_by_id(category_id: str) -> Optional[Category]:
        return await Category.get(category_id)
    
    @staticmethod
    async def update_category(category_id: str, data: dict) -> Optional[Category]:
        category = await Category.get(category_id)
        if not category:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(category, key, value)
        await category.save()
        return category
    
    @staticmethod
    async def delete_category(category_id: str) -> bool:
        category = await Category.get(category_id)
        if category:
            await category.delete()
            return True
        return False
