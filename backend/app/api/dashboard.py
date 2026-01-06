from fastapi import APIRouter, HTTPException
from datetime import datetime, date
from collections import defaultdict
from app.models.analytics import DashboardAnalytics, MaterialTypePercentage, MonthlyOrder, MonthlyRevenue, OrderStatusPercentage
from beanie import Document
from app.deps.auth import role_required
from app.models.user import Role, User
from app.models.order import Order, OrderStatus
from app.models.products import Product
from app.services.user import UserService
from app.services.order_service import orderService
from app.services.product import ProductService


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

async def count_documents(model: Document) -> int:
    """Helper function to count all documents in a collection."""
    return await model.find_all().count()


@router.get("/analytics", response_model=DashboardAnalytics)
async def get_dashboard_analytics(
    user: User = role_required(Role.ADMIN, Role.Super_Admin)
) -> DashboardAnalytics:
    try:
        total_users = await count_documents(User)
        all_products = await ProductService.get_all_products()
        all_orders = await orderService.get_all_orders()

        total_available_products = len(all_products)
        pending_orders = await orderService.get_all_orders(status=OrderStatus.PENDING)
        total_pending_orders = len(pending_orders)

        order_status_counts = defaultdict(int)
        for order in all_orders:
            order_status_counts[order.status.value] += 1

        total_orders = len(all_orders)
        order_status_percentages = [
            OrderStatusPercentage(
                status=status,
                percentage=round((count / total_orders) * 100) if total_orders > 0 else 0
            )
            for status, count in order_status_counts.items()
        ]

        # Category distribution instead of material type
        category_counts = defaultdict(int)
        for product in all_products:
            if product.category:
                category_counts[product.category] += 1

        total_products_for_chart = sum(category_counts.values())
        material_type_percentages = [
            MaterialTypePercentage(
                material_type=category,
                percentage=round((count / total_products_for_chart) * 100)
                if total_products_for_chart > 0 else 0
            )
            for category, count in category_counts.items()
        ]

        monthly_orders_map = defaultdict(int)
        monthly_revenue_map = defaultdict(float)

        current_year = datetime.now().year
        for order in all_orders:
            if order.created_at and order.created_at.year == current_year:
                month_name = order.created_at.strftime("%b")
                monthly_orders_map[month_name] += 1

                order_revenue = 0
                for product_link, quantity in order.item:
                    if product_link:
                        order_revenue += product_link.price_dzd * quantity
                monthly_revenue_map[month_name] += order_revenue

        monthly_orders = [
            MonthlyOrder(month=month, count=count)
            for month, count in monthly_orders_map.items()
        ]
        monthly_revenue = [
            MonthlyRevenue(month=month, revenue=revenue)
            for month, revenue in monthly_revenue_map.items()
        ]

        return DashboardAnalytics(
            total_users=total_users,
            total_available_materials=total_available_products,
            total_pending_orders=total_pending_orders,
            total_today_appointments=0,  # No appointments in e-commerce
            order_status_percentages=order_status_percentages,
            material_type_percentages=material_type_percentages,
            monthly_orders=monthly_orders,
            monthly_revenue=monthly_revenue,
        )

    except Exception as e:
        print(f"An error occurred while generating dashboard analytics: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while fetching dashboard analytics."
        )
