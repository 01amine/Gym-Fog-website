from fastapi import HTTPException
from app.models.order import Order, OrderCreate, OrderStatus, DeliveryType, GuestOrderCreate, OrderItemCreate
from app.models.user import User
from app.models.products import Product
from app.services.zr_service import zr_express_service
from typing import List, Optional
from datetime import datetime
from beanie import PydanticObjectId


class OrderService:

    @staticmethod
    async def create_order(student: User, items: List[OrderCreate]) -> Order:
        order_items: List[tuple[Product, int]] = []

        for item in items:
            product = await Product.get(item.product_id)
            if not product:
                raise HTTPException(status_code=404, detail=f"Product not found: {item.product_id}")
            order_items.append((product, item.quantity))

        delivery_type = items[0].delivery_type if items else DeliveryType.DELIVERY
        delivery_address = items[0].delivery_address if items else None
        delivery_phone = items[0].delivery_phone if items else None

        order = Order(
            student=student,
            item=order_items,
            delivery_type=delivery_type,
            delivery_address=delivery_address,
            delivery_phone=delivery_phone,
            is_guest_order=False
        )
        await order.insert()
        return order

    @staticmethod
    async def create_guest_order(order_data: GuestOrderCreate) -> Order:
        """Create an order for guest users (no authentication required)"""
        order_items: List[tuple[Product, int]] = []

        for item in order_data.items:
            product = await Product.get(item.product_id)
            if not product:
                raise HTTPException(status_code=404, detail=f"Product not found: {item.product_id}")
            if product.stock_quantity < item.quantity:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for product: {product.title}")
            order_items.append((product, item.quantity))

        order = Order(
            student=None,
            is_guest_order=True,
            guest_name=order_data.guest_name,
            guest_phone=order_data.guest_phone,
            guest_email=order_data.guest_email,
            item=order_items,
            delivery_type=order_data.delivery_type,
            delivery_address=order_data.delivery_address,
            delivery_phone=order_data.guest_phone,
            wilaya=order_data.wilaya
        )
        await order.insert()
        return order

    @staticmethod
    async def get_orders_by_student(student_id: str) -> List[Order]:
        return await Order.find(Order.student.id == PydanticObjectId(student_id)).sort("-created_at").to_list()

    @staticmethod
    async def get_all_orders(status: Optional[OrderStatus] = None) -> List[Order]:
        if status:
            return await Order.find(Order.status == status).sort("-created_at").to_list()
        return await Order.find_all().sort("-created_at").to_list()

    @staticmethod
    async def get_orders_by_admin(admin_id: str) -> List[Order]:
        return await Order.find(Order.assigned_admin == PydanticObjectId(admin_id)).sort("-created_at").to_list()

    @staticmethod
    async def accept_order_for_printing(order_id: str, admin: User) -> Optional[Order]:
        """Accept an order - changes status from PENDING to ACCEPTED"""
        order = await Order.get(order_id)
        if not order or order.status != OrderStatus.PENDING:
            return None
        order.status = OrderStatus.ACCEPTED
        order.assigned_admin = admin
        await order.save()
        return order

    @staticmethod
    async def decline_order(order_id: str, admin: User) -> Optional[Order]:
        """Decline an order - changes status from PENDING to DECLINED"""
        order = await Order.get(order_id)
        if not order or order.status != OrderStatus.PENDING:
            return None
        order.status = OrderStatus.DECLINED
        order.assigned_admin = admin
        await order.save()
        return order

    @staticmethod
    async def mark_order_as_ready(order_id: str, admin: User) -> Optional[Order]:
        order = await Order.get(order_id)
        if not order or order.status != OrderStatus.ACCEPTED:
            return None

        order.status = OrderStatus.READY
        order.assigned_admin = admin

        if order.delivery_type == DeliveryType.DELIVERY:
            try:
                # For guest orders, we pass None as student
                student = None
                if order.student:
                    student = await order.student.fetch()

                tracking_id = await zr_express_service.create_delivery(order, student)

                if tracking_id:
                    order.zr_tracking_id = tracking_id
                    order.status = OrderStatus.OUT_FOR_DELIVERY
                    print(f"Order {order_id} sent to ZR Express with tracking ID: {tracking_id}")
                else:
                    print(f"Failed to create ZR Express delivery for order {order_id}")
            except Exception as e:
                print(f"Error creating ZR Express delivery for order {order_id}: {str(e)}")

        await order.save()
        return order

    @staticmethod
    async def mark_order_as_delivered(order_id: str, admin: User) -> Optional[Order]:
        order = await Order.get(order_id)
        if not order:
            return None
            
        
        valid_statuses = [OrderStatus.READY]
        if order.delivery_type == DeliveryType.DELIVERY:
            valid_statuses.append(OrderStatus.OUT_FOR_DELIVERY)
            
        if order.status not in valid_statuses:
            return None

        
        if order.delivery_type == DeliveryType.PICKUP:
            if str(order.assigned_admin) != str(admin.id):
                return None

        order.status = OrderStatus.DELIVERED
        await order.save()
        return order

    @staticmethod
    async def reassign_order_admin(order_id: str, new_admin: User) -> Optional[Order]:
        order = await Order.get(order_id)
        if not order:
            return None
        order.assigned_admin = new_admin
        await order.save()
        return order

    @staticmethod
    async def delete_order(order_id: str) -> bool:
        order = await Order.get(order_id)
        if order:
            await order.delete()
            return True
        return False

    @staticmethod
    async def get_order_by_id(order_id: str) -> Optional[Order]:
        return await Order.get(order_id)
    
    @staticmethod
    async def get_delivery_status(order_id: str) -> Optional[dict]:
        """
        Get ZR Express delivery status for an order
        """
        order = await Order.get(order_id)
        if not order or not order.zr_tracking_id:
            return None
            
        try:
            status_result = await zr_express_service.get_delivery_status([order.zr_tracking_id])
            return status_result
        except Exception as e:
            print(f"Error getting delivery status for order {order_id}: {str(e)}")
            return None


# Create instance for backward compatibility
orderService = OrderService()
