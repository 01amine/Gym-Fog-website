"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminLayout from "@/components/layout/admin-layout"
import StatsCards from "@/components/dashboard/stats-cards"
import RecentOrders from "@/components/dashboard/recent-orders"
import { PieChartComponent, BarChartComponent, LineChartComponent } from "@/components/ui/chart"
import { useOrdersForAdmin } from "@/hooks/queries/useorder"
import { useAnalytics } from "@/hooks/queries/useanalytics"
import { DashboardAnalytics } from "@/lib/types/analytics"
import { StatsCardsLoading, ChartLoading, TableLoading } from "@/components/ui/loading"
import { DataError } from "@/components/ui/error"

export default function DashboardPage() {
  const { data: Orders, isError, isLoading } = useOrdersForAdmin()
  const { data: Analytics, isError: isErrorAnalytics, isLoading: isLoadingAnalytics } = useAnalytics()

  if (isLoading || isLoadingAnalytics) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <StatsCardsLoading />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartLoading />
            <ChartLoading />
            <ChartLoading />
            <ChartLoading />
          </div>
          <TableLoading rows={5} />
        </div>
      </AdminLayout>
    )
  }

  if (isError || isErrorAnalytics || !Analytics) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <DataError
            error={isError ? "Error loading orders" : isErrorAnalytics ? "Error loading analytics" : "Missing data"}
            onRetry={() => window.location.reload()}
            title="Dashboard Loading Error"
            message="Unable to load dashboard data. Please try again."
          />
        </div>
      </AdminLayout>
    )
  }

  const stats = {
    totalUsers: Analytics.total_users,
    totalMaterials: Analytics.total_available_materials,
    pendingOrders: Analytics.total_pending_orders,
    todayAppointments: Analytics.total_today_appointments,
  }

  // Order status chart (convert backend format → chart format)
  const orderStatusData = Analytics.order_status_percentages.map(status => ({
    name: status.status,
    value: status.percentage,
  }))

  const materialTypeData = Analytics.material_type_percentages.map(mat => ({
    name: mat.material_type,
    value: mat.percentage,
  }))

  // Monthly orders chart
  const monthlyOrdersData = Analytics.monthly_orders.map(order => ({
    name: order.month,
    value: order.count,
  }))

  const revenueData = Analytics.monthly_revenue.map(rev => ({
    name: rev.month,
    value: rev.revenue,
  }))

  const orderStatusPieData = [
    { name: "Pending", value: Orders.filter(o => o.status === "pending").length },
    { name: "Printing", value: Orders.filter(o => o.status === "printing").length },
    { name: "Ready", value: Orders.filter(o => o.status === "ready").length },
    { name: "Delivered", value: Orders.filter(o => o.status === "delivered").length },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Order Status</CardTitle>
              <CardDescription className="text-gray-400">Distribution of orders by status</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChartComponent data={orderStatusData} className="h-64" />
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Product Types</CardTitle>
              <CardDescription className="text-gray-400">Distribution of products by type</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChartComponent data={materialTypeData} className="h-64" />
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Order Trends</CardTitle>
              <CardDescription className="text-gray-400">Number of orders per month</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent data={monthlyOrdersData} className="h-64" />
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Revenue</CardTitle>
              <CardDescription className="text-gray-400">Monthly revenue in DZD</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartComponent data={revenueData} className="h-64" />
            </CardContent>
          </Card>
        </div>

        <RecentOrders orders={Orders} />
      </div>
    </AdminLayout>
  )
}
