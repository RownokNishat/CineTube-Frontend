
import AppointmentBarChart from "@/components/shared/AppointmentBarChart";
import AppointmentPieChart from "@/components/shared/AppointmentPieChart";
import StatsCard from "@/components/shared/StatsCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getDashboardData } from "@/services/dashboard.services";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const PaymentsManagementPage = async () => {
  const response = await getDashboardData();

  if (!response.success || !response.data) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Payments Management</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load payment analytics</AlertTitle>
          <AlertDescription>
            {response.message || "Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const data = response.data;
  const paymentCount = Number(data.paymentCount || 0);
  const totalRevenue = Number(data.totalRevenue || 0);
  const avgPaymentValue = paymentCount > 0 ? totalRevenue / paymentCount : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Payments Management</h1>
        <p className="text-sm text-muted-foreground">
          Monitor overall transaction volume and revenue performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Payments"
          value={paymentCount}
          iconName="Wallet"
          description="Completed transactions"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          iconName="DollarSign"
          description="Gross earnings"
        />
        <StatsCard
          title="Average Payment"
          value={formatCurrency(avgPaymentValue)}
          iconName="Receipt"
          description="Revenue per payment"
        />
        <StatsCard
          title="Revenue Per User"
          value={formatCurrency(data.userCount ? totalRevenue / data.userCount : 0)}
          iconName="Users"
          description="Based on total users"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-6">
        <AppointmentBarChart data={data.barChartData || []} />
        <AppointmentPieChart
          data={data.pieChartData || []}
          title="Payment Status Mix"
          description="Distribution of payment outcomes"
        />
      </div>
    </div>
  );
};

export default PaymentsManagementPage;