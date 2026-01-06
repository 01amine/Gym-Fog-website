from fastapi import APIRouter, HTTPException, Body
from typing import List, Optional
from datetime import datetime
from app.services.order_service import orderService
from app.models.order import Order, OrderCreate, OrderStatus, orderResponse, serialize_order, serialize_order_F, DeliveryType, GuestOrderCreate
from app.models.user import User, Role
from app.deps.auth import role_required

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=orderResponse)
async def create_order(
    order_data: List[OrderCreate] = Body(...),
    user: User = role_required(Role.USER, Role.ADMIN, Role.Super_Admin)
):
    """
    Create a new order with delivery preference (authenticated users)
    """
    order = await orderService.create_order(user, order_data)
    return serialize_order(order)


@router.post("/guest")
async def create_guest_order(order_data: GuestOrderCreate):
    """
    Create a new order for guest users (no authentication required).
    Requires: guest_name, guest_phone, delivery_address, wilaya, items
    """
    order = await orderService.create_guest_order(order_data)
    return serialize_order(order)


@router.get("/my", response_model=List[orderResponse])
async def get_my_orders(user: User = role_required(Role.USER, Role.ADMIN, Role.Super_Admin)):
    orders = await orderService.get_orders_by_student(str(user.id))
    return [serialize_order(order) for order in orders]


@router.get("/get_admin_orders")
async def get_admin_orders(user: User = role_required(Role.ADMIN, Role.Super_Admin)):
    ReturnOrders = []
    orders = await orderService.get_all_orders()

    # Super_Admin can see all orders, regular admins only see their zone
    if Role.Super_Admin in user.roles:
        # Super_Admin sees all orders regardless of zone
        for order in orders:
            if order.is_guest_order:
                # Guest orders don't have a student
                ReturnOrders.append(serialize_order_F(order, None))
            else:
                student = await order.student.fetch() if order.student else None
                ReturnOrders.append(serialize_order_F(order, student))
    else:
        # Regular admin only sees orders from their zone
        area: str = user.era
        for order in orders:
            if order.is_guest_order:
                # Include all guest orders for regular admins (or filter by wilaya)
                ReturnOrders.append(serialize_order_F(order, None))
            else:
                student = await order.student.fetch() if order.student else None
                if student and student.era == area:
                    ReturnOrders.append(serialize_order_F(order, student))

    print(f"Returning {len(ReturnOrders)} orders for user {user.email} with roles {user.roles}")
    return ReturnOrders


@router.get("/admin", response_model=List[Order])
async def get_all_orders(
    status: Optional[OrderStatus] = None,
    admin: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    return await orderService.get_all_orders(status)


@router.patch("/admin/{order_id}/accept", response_model=Order)
async def accept_order(
    order_id: str,
    admin: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    order = await orderService.accept_order_for_printing(order_id, admin)
    if not order:
        raise HTTPException(status_code=400, detail="Order not found or already accepted")
    return order


@router.patch("/admin/{order_id}/ready")
async def mark_order_ready(
    order_id: str,
    admin: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    """
    Mark order as ready. If delivery_type is DELIVERY, automatically sends to ZR Express
    """
    order = await orderService.mark_order_as_ready(order_id, admin)
    if not order:
        raise HTTPException(status_code=400, detail="Order must be in 'printing' state")
    
    response_data = serialize_order(order)
    
    
    if order.delivery_type == DeliveryType.DELIVERY and order.zr_tracking_id:
        response_data["message"] = f"Order sent to ZR Express for delivery. Tracking ID: {order.zr_tracking_id}"
    elif order.delivery_type == DeliveryType.DELIVERY and not order.zr_tracking_id:
        response_data["message"] = "Order ready but delivery creation failed. Please try again or contact support."
    else:
        response_data["message"] = "Order ready for pickup"
    
    return response_data

@router.patch("/admin/{order_id}/decline")
async def decline_order(
    order_id: str,
    admin: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    """
    Decline an order - changes status to DECLINED
    """
    order = await orderService.decline_order(order_id, admin)
    if not order:
        raise HTTPException(status_code=400, detail="Order not found or not in pending status")
    return serialize_order(order)


@router.delete("/admin/{order_id}")
async def delete_order(
    order_id: str,
    admin: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    """
    Permanently delete an order
    """
    result = await orderService.delete_order(order_id=order_id)
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted successfully"}

@router.patch("/admin/{order_id}/delivered", response_model=Order)
async def mark_delivered(
    order_id: str,
    admin: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    order = await orderService.mark_order_as_delivered(order_id, admin)
    if not order:
        raise HTTPException(
            status_code=400, 
            detail="Order not in valid state for delivery confirmation or admin mismatch"
        )
    return order


@router.patch("/admin/{order_id}/make_printing", response_model=Order)
async def make_printing(
    order_id: str,
    admin: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    order = await orderService.reassign_order_admin(order_id, admin)
    if not order:
        raise HTTPException(status_code=400, detail="Order not found")
    return order


@router.get("/{order_id}/delivery-status")
async def get_delivery_status(
    order_id: str,
    user: User = role_required(Role.USER, Role.ADMIN, Role.Super_Admin)
):
    """
    Get ZR Express delivery status for an order
    """
    
    if user.role == Role.USER:
        order = await orderService.get_order_by_id(order_id)
        if not order or str(order.student.id) != str(user.id):
            raise HTTPException(status_code=403, detail="Access denied")
    
    status = await orderService.get_delivery_status(order_id)
    if not status:
        raise HTTPException(status_code=404, detail="Delivery status not found or order not sent for delivery")
    
    return status


@router.get("/{user_id}", response_model=List[Order])
async def get_user_orders(
    user_id: str,
    user: User = role_required(Role.ADMIN, Role.Super_Admin)
):
    orders = await orderService.get_orders_by_student(user_id)
    if not orders:
        raise HTTPException(status_code=404, detail="No orders found for this user")
    return [serialize_order(order) for order in orders]



@router.get("/delivery-types", response_model=List[str])
async def get_delivery_types():
    """
    Get available delivery types
    """
    return [delivery_type.value for delivery_type in DeliveryType]
