
import StatsCard from "@/components/shared/StatsCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/services/dashboard.services";
import { format } from "date-fns";
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
  const monthlyTrend = (data.barChartData || []).map((item) => ({
    month: format(new Date(item.month), "MMM yyyy"),
    count: Number(item.count || 0),
  }));
  const statusDistribution = (data.pieChartData || []).map((item) => ({
    status: item.status,
    count: Number(item.count || 0),
  }));

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Payment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyTrend.length === 0 ? (
              <p className="text-sm text-muted-foreground">No monthly data available.</p>
            ) : (
              <div className="space-y-2">
                {monthlyTrend.map((item) => (
                  <div key={item.month} className="flex items-center justify-between rounded border p-2 text-sm">
                    <span className="text-muted-foreground">{item.month}</span>
                    <span className="font-medium">{item.count} payments</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status Mix</CardTitle>
          </CardHeader>
          <CardContent>
            {statusDistribution.length === 0 ? (
              <p className="text-sm text-muted-foreground">No status distribution data available.</p>
            ) : (
              <div className="space-y-2">
                {statusDistribution.map((item) => (
                  <div key={item.status} className="flex items-center justify-between rounded border p-2 text-sm">
                    <span className="text-muted-foreground">{item.status}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsManagementPage;