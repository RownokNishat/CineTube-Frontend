"use client"

import AppointmentBarChart from "@/components/shared/AppointmentBarChart"
import AppointmentPieChart from "@/components/shared/AppointmentPieChart"
import StatsCard from "@/components/shared/StatsCard"
import { getDashboardData } from "@/services/dashboard.services"
import { ApiResponse } from "@/types/api.types"
import { PaymentDashboardData } from "@/types/dashboard.types"
import { useQuery } from "@tanstack/react-query"

const AdminDashboardContent = () => {
  const { data: adminDashboardData } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always", // Refetch the data when the window regains focus
  });

  const data = (adminDashboardData as ApiResponse<PaymentDashboardData> | undefined)?.data;
  const pieData = data?.purchaseStatusBreakdown ?? [];

  return (
    <div>
      <StatsCard
        title="Total Payments"
        value={data?.overview?.paymentCount || 0}
        iconName="CalendarDays"
        description="Completed payments in selected period"
      />
      <StatsCard
        title="Paying Users"
        value={data?.overview?.userCount || 0}
        iconName="Users"
        description="Unique users with transactions"
      />

      <AppointmentBarChart data={data?.barChartData || []} />

      <AppointmentPieChart data={pieData} title="Purchase Status" description="Distribution by status" />
    </div>
  );
}

export default AdminDashboardContent