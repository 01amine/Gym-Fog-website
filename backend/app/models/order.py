from datetime import datetime
from enum import Enum
from typing import List, Optional
from beanie import Document, Link
from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field
from app.models.user import User
from app.models.products import Product



class OrderStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    READY = "ready"
    DELIVERED = "delivered"
    OUT_FOR_DELIVERY = "out_for_delivery"

class DeliveryType(str, Enum):
    PICKUP = "pickup"
    DELIVERY = "delivery"

class Order(Document):
    # For authenticated users (optional now)
    student: Optional[Link[User]] = None
    # For guest orders
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None
    is_guest_order: bool = False

    item: List[tuple[Link[Product], int]]
    status: OrderStatus = OrderStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    assigned_admin: Optional[Link[User]] = None
    delivery_type: DeliveryType = DeliveryType.DELIVERY
    delivery_address: Optional[str] = None
    delivery_phone: Optional[str] = None
    zr_tracking_id: Optional[str] = None
    wilaya: Optional[str] = None

    class Settings:
        name = "orders"


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int

class OrderCreate(BaseModel):
    product_id: str
    quantity: int
    delivery_type: DeliveryType = DeliveryType.DELIVERY
    delivery_address: Optional[str] = None
    delivery_phone: Optional[str] = None

class GuestOrderCreate(BaseModel):
    guest_name: str
    guest_phone: str
    guest_email: Optional[str] = None
    delivery_address: str
    wilaya: str
    items: List[OrderItemCreate]
    delivery_type: DeliveryType = DeliveryType.DELIVERY
    


class orderResponse(BaseModel):
    id: str = Field(alias="_id")
    status: OrderStatus
    item: List[tuple[dict, int]]
    delivery_type: DeliveryType
    delivery_address: Optional[str] = None
    zr_tracking_id: Optional[str] = None
    created_at: datetime
    is_guest_order: bool = False
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None
    guest_email: Optional[str] = None
    wilaya: Optional[str] = None
    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }


def serialize_order(order: Order):
    return {
        "id": str(order.id),
        "status": order.status,
        "delivery_type": order.delivery_type,
        "delivery_address": order.delivery_address,
        "delivery_phone": order.delivery_phone,
        "zr_tracking_id": order.zr_tracking_id,
        "created_at": order.created_at,
        "is_guest_order": order.is_guest_order,
        "guest_name": order.guest_name,
        "guest_phone": order.guest_phone,
        "guest_email": order.guest_email,
        "wilaya": order.wilaya,
        "item": [
            (
                {
                    "id": str(product.id),
                    "title": product.title,
                    "description": product.description,
                    "image_urls": product.image_urls,
                    "category": product.category,
                    "price_dzd": product.price_dzd,
                },
                qty,
            )
            for product, qty in order.item
        ],
    }


def serialize_order_F(order: Order, user: User = None):
    # Handle both guest orders and authenticated user orders
    if order.is_guest_order:
        client_info = {
            "full_name": order.guest_name,
            "email": order.guest_email,
            "phone": order.guest_phone,
        }
    else:
        client_info = {
            "full_name": user.full_name if user else None,
            "email": user.email if user else None,
            "phone": user.phone_number if user else None,
        }

    return {
        "_id": str(order.id),
        "client": client_info,
        "is_guest_order": order.is_guest_order,
        "item": [
            (
                {
                    "title": product.title,
                    "category": product.category,
                    "price_dzd": product.price_dzd,
                },
                int(qty),
            )
            for product, qty in order.item
        ],
        "status": order.status.value,
        "delivery_type": order.delivery_type.value,
        "delivery_address": order.delivery_address,
        "delivery_phone": order.delivery_phone or (order.guest_phone if order.is_guest_order else None),
        "wilaya": order.wilaya,
        "zr_tracking_id": order.zr_tracking_id,
        "created_at": order.created_at.isoformat(),
    }
