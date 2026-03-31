
import StatsCard from "@/components/shared/StatsCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/services/dashboard.services";
import { getSubscriptionPlans } from "@/services/subscription.services";
import { format } from "date-fns";
import { AlertCircle, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const PaymentsManagementPage = async () => {
  const [analyticsResponse, plansResponse] = await Promise.all([
    getDashboardData(),
    getSubscriptionPlans().catch((error) => ({
      success: false as const,
      message: error instanceof Error ? error.message : "Failed to load plans",
    })),
  ]);

  const hasAnalytics = analyticsResponse.success && !!analyticsResponse.data;
  const data = hasAnalytics ? analyticsResponse.data : null;
  const paymentCount = Number(data?.paymentCount || 0);
  const totalRevenue = Number(data?.totalRevenue || 0);
  const avgPaymentValue = paymentCount > 0 ? totalRevenue / paymentCount : 0;
  const monthlyTrend = (data?.barChartData || []).map((item) => ({
    month: format(new Date(item.month), "MMM yyyy"),
    count: Number(item.count || 0),
  }));
  const statusDistribution = (data?.pieChartData || []).map((item) => ({
    status: item.status,
    count: Number(item.count || 0),
  }));
  const plans = plansResponse.success ? plansResponse.data : [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Payments Management</h1>
        <p className="text-sm text-muted-foreground">
          Monitor overall transaction volume and revenue performance.
        </p>
      </div>

      {!hasAnalytics && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment analytics endpoint unavailable</AlertTitle>
          <AlertDescription>
            {analyticsResponse.message || "The backend did not return analytics data."} The page is showing available payment configuration data instead.
          </AlertDescription>
        </Alert>
      )}

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
          value={formatCurrency(data?.userCount ? totalRevenue / data.userCount : 0)}
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
            {hasAnalytics && monthlyTrend.length > 0 ? (
              <div className="space-y-2">
                {monthlyTrend.map((item) => (
                  <div key={item.month} className="flex items-center justify-between rounded border p-2 text-sm">
                    <span className="text-muted-foreground">{item.month}</span>
                    <span className="font-medium">{item.count} payments</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No monthly payment analytics available from the backend.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status Mix</CardTitle>
          </CardHeader>
          <CardContent>
            {hasAnalytics && statusDistribution.length > 0 ? (
              <div className="space-y-2">
                {statusDistribution.map((item) => (
                  <div key={item.status} className="flex items-center justify-between rounded border p-2 text-sm">
                    <span className="text-muted-foreground">{item.status}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No payment status distribution data available from the backend.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subscription plan data is available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.plan} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-medium">
                      <CreditCard className="size-4 text-muted-foreground" />
                      <span>{plan.plan}</span>
                    </div>
                    <Badge variant="secondary">{plan.duration ?? "Custom"}</Badge>
                  </div>
                  <p className="mb-3 text-2xl font-semibold">{formatCurrency(Number(plan.price || 0))}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {(plan.features ?? []).map((feature) => (
                      <p key={feature}>{feature}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsManagementPage;