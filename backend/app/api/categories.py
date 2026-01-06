from app.models.category import Category, CategoryCreate, CategoryUpdate
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List, Optional
from app.models.user import User, Role
from app.deps.auth import role_required
from bson import ObjectId
from app.minio import ImageBucket

router = APIRouter(prefix="/categories", tags=["Categories"])

image_bucket = ImageBucket(file_prefix="categories/images")


@router.post("/", response_model=dict)
async def create_category(
    title: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    user: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    """Create a new category (admin only)"""
    image_url = None
    if image:
        try:
            image_url = await image_bucket.upload_file(image)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    
    category = Category(
        title=title,
        description=description,
        image_url=image_url
    )
    await category.insert()
    return {
        "id": str(category.id),
        "title": category.title,
        "description": category.description,
        "image_url": category.image_url,
        "created_at": category.created_at
    }


@router.get("/", response_model=List[dict])
async def get_categories():
    """Get all categories (public endpoint, no authentication required)"""
    categories = await Category.find_all().to_list()
    return [
        {
            "id": str(cat.id),
            "title": cat.title,
            "description": cat.description,
            "image_url": cat.image_url,
            "created_at": cat.created_at
        }
        for cat in categories
    ]


@router.get("/{category_id}", response_model=dict)
async def get_category_by_id(category_id: str):
    """Get category by ID (public endpoint, no authentication required)"""
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")
    
    category = await Category.get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {
        "id": str(category.id),
        "title": category.title,
        "description": category.description,
        "image_url": category.image_url,
        "created_at": category.created_at
    }


@router.patch("/{category_id}", response_model=dict)
async def update_category(
    category_id: str,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    user: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    """Update category (admin only)"""
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")
    
    category = await Category.get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if title:
        category.title = title
    if description:
        category.description = description
    if image:
        try:
            image_url = await image_bucket.upload_file(image)
            category.image_url = image_url
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    
    await category.save()
    return {
        "id": str(category.id),
        "title": category.title,
        "description": category.description,
        "image_url": category.image_url,
        "created_at": category.created_at
    }


@router.delete("/{category_id}", response_model=dict)
async def delete_category(
    category_id: str,
    user: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    """Delete category (admin only)"""
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")
    
    category = await Category.get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    await category.delete()
    return {"message": "Category deleted successfully", "id": category_id}