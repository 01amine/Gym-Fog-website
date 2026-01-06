from datetime import datetime
import os
from fastapi import APIRouter, Query, UploadFile, File, Form, HTTPException
from typing import List, Optional
from fastapi.responses import StreamingResponse
from app.models.products import Product, ProductCreate, ProductUpdate
from app.models.user import Role, User
from app.deps.auth import role_required
import uuid
from app.minio import ImageBucket
from bson import ObjectId

router = APIRouter(prefix="/products", tags=["Products"])

image_bucket = ImageBucket(file_prefix="products/images")


@router.get("/", response_model=List[dict])
async def get_products(
    title: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    brand: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
):
    """Get all products with optional filters (public endpoint, no authentication required)"""
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
    
    products = await Product.find(query).sort("-created_at").skip(skip).limit(limit).to_list()
    
    return [
        {
            "id": str(product.id),
            "title": product.title,
            "description": product.description,
            "image_urls": product.image_urls,
            "category": product.category,
            "price_dzd": product.price_dzd,
            "stock_quantity": product.stock_quantity,
            "brand": product.brand,
            "sizes": product.sizes,
            "colors": product.colors,
            "weight": product.weight,
            "created_at": product.created_at
        }
        for product in products
    ]


@router.get("/{product_id}", response_model=dict)
async def get_product_by_id(product_id: str):
    """Get product by ID (public endpoint, no authentication required)"""
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {
        "id": str(product.id),
        "title": product.title,
        "description": product.description,
        "image_urls": product.image_urls,
        "category": product.category,
        "price_dzd": product.price_dzd,
        "stock_quantity": product.stock_quantity,
        "brand": product.brand,
        "sizes": product.sizes,
        "colors": product.colors,
        "weight": product.weight,
        "created_at": product.created_at
    }


@router.post("/", response_model=dict)
async def create_product(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    category: str = Form(...),
    price_dzd: float = Form(...),
    stock_quantity: int = Form(0),
    brand: Optional[str] = Form(None),
    sizes: Optional[str] = Form(None),  # Comma-separated string
    colors: Optional[str] = Form(None),  # Comma-separated string
    weight: Optional[float] = Form(None),
    images: List[UploadFile] = File([]),
    user: User = role_required(Role.ADMIN, Role.Super_Admin),
):
    """Create a new product with images (admin only)"""
    image_urls = []
    
    # Upload images
    for image in images:
        try:
            image_url = await image_bucket.put(image)
            image_urls.append(image_url)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    
    # Parse comma-separated strings to lists
    sizes_list = [s.strip() for s in sizes.split(",")] if sizes else []
    colors_list = [c.strip() for c in colors.split(",")] if colors else []
    
    product = Product(
        title=title,
        description=description,
        image_urls=image_urls,
        category=category,
        price_dzd=price_dzd,
        stock_quantity=stock_quantity,
        brand=brand,
        sizes=sizes_list,
        colors=colors_list,
        weight=weight
    )
    await product.insert()
    
    return {
        "id": str(product.id),
        "title": product.title,
        "description": product.description,
        "image_urls": product.image_urls,
        "category": product.category,
        "price_dzd": product.price_dzd,
        "stock_quantity": product.stock_quantity,
        "brand": product.brand,
        "sizes": product.sizes,
        "colors": product.colors,
        "weight": product.weight,
        "created_at": product.created_at
    }


@router.patch("/{product_id}", response_model=dict)
async def update_product(
    product_id: str,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    price_dzd: Optional[float] = Form(None),
    stock_quantity: Optional[int] = Form(None),
    brand: Optional[str] = Form(None),
    sizes: Optional[str] = Form(None),
    colors: Optional[str] = Form(None),
    weight: Optional[float] = Form(None),
    images: List[UploadFile] = File([]),
    user: User = role_required(Role.ADMIN, Role.Super_Admin),
):
    """Update product (admin only)"""
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")
    
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Upload new images if provided
    if images:
        new_image_urls = []
        for image in images:
            try:
                image_url = await image_bucket.put(image)
                new_image_urls.append(image_url)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
        product.image_urls.extend(new_image_urls)
    
    # Update fields
    if title is not None:
        product.title = title
    if description is not None:
        product.description = description
    if category is not None:
        product.category = category
    if price_dzd is not None:
        product.price_dzd = price_dzd
    if stock_quantity is not None:
        product.stock_quantity = stock_quantity
    if brand is not None:
        product.brand = brand
    if sizes is not None:
        product.sizes = [s.strip() for s in sizes.split(",")]
    if colors is not None:
        product.colors = [c.strip() for c in colors.split(",")]
    if weight is not None:
        product.weight = weight
    
    await product.save()
    
    return {
        "id": str(product.id),
        "title": product.title,
        "description": product.description,
        "image_urls": product.image_urls,
        "category": product.category,
        "price_dzd": product.price_dzd,
        "stock_quantity": product.stock_quantity,
        "brand": product.brand,
        "sizes": product.sizes,
        "colors": product.colors,
        "weight": product.weight,
        "created_at": product.created_at
    }


@router.delete("/{product_id}", response_model=dict)
async def delete_product(
    product_id: str,
    user: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    """Delete product (admin only)"""
    if not ObjectId.is_valid(product_id):
        raise HTTPException(status_code=400, detail="Invalid product ID")

    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    await product.delete()
    return {"message": "Product deleted successfully", "id": product_id}


@router.get("/images/{image_id}")
async def get_product_image(image_id: str):
    """Get product image by ID (public endpoint)"""
    try:
        data, filename, content_type = await image_bucket.get(image_id)
        return StreamingResponse(
            iter([data]),
            media_type=content_type,
            headers={"Content-Disposition": f"inline; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail="Image not found")
