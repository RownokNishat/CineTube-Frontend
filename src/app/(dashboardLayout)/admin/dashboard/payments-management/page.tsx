import StatsCard from "@/components/shared/StatsCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPaymentDashboardData, getPaymentTransactions } from "@/services/dashboard.services";
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
  const [analyticsResponse, transactionsResponse, plansResponse] = await Promise.all([
    getPaymentDashboardData(30),
    getPaymentTransactions(1, 15),
    getSubscriptionPlans().catch((error) => ({
      success: false as const,
      message: error instanceof Error ? error.message : "Failed to load plans",
    })),
  ]);

  const hasAnalytics = analyticsResponse.success && !!analyticsResponse.data;
  const data = hasAnalytics ? analyticsResponse.data : null;
  const overview = data?.overview;
  const paymentCount = Number(overview?.paymentCount ?? data?.paymentCount ?? 0);
  const totalRevenue = Number(overview?.totalRevenue ?? data?.totalRevenue ?? 0);
  const userCount = Number(overview?.userCount ?? data?.userCount ?? 0);
  const purchaseRevenue = Number(overview?.purchaseRevenue ?? 0);
  const subscriptionRevenue = Number(overview?.subscriptionRevenue ?? 0);
  const rentalRevenue = Number(overview?.rentalRevenue ?? 0);
  const avgPaymentValue = paymentCount > 0 ? totalRevenue / paymentCount : 0;
  const trend = (data?.barChartData || []).map((item) => {
    const label = item.day ?? item.month;
    return {
      label: label ? format(new Date(label), item.day ? "dd MMM" : "MMM yyyy") : "-",
      count: Number(item.count || 0),
      revenue: Number(item.revenue || 0),
    };
  });
  const statusDistribution = (data?.purchaseStatusBreakdown || data?.pieChartData || []).map((item) => ({
    status: item.status,
    count: Number(item.count || 0),
  }));
  const subscriptionStatuses = (data?.subscriptionStatusBreakdown || []).map((item) => ({
    status: item.status,
    count: Number(item.count || 0),
  }));

  const transactions = transactionsResponse.success ? transactionsResponse.data : [];
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
          value={formatCurrency(userCount ? totalRevenue / userCount : 0)}
          iconName="Users"
          description="Based on total users"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(purchaseRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Subscription Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(subscriptionRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rental Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{formatCurrency(rentalRevenue)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {hasAnalytics && trend.length > 0 ? (
              <div className="space-y-2">
                {trend.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded border p-2 text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <div className="text-right">
                      <p className="font-medium">{item.count} payments</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.revenue)}</p>
                    </div>
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
            <CardTitle>Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {hasAnalytics && (statusDistribution.length > 0 || subscriptionStatuses.length > 0) ? (
              <div className="space-y-4">
                {statusDistribution.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Purchases</h4>
                    {statusDistribution.map((item) => (
                      <div key={`purchase-${item.status}`} className="flex items-center justify-between rounded border p-2 text-sm">
                        <span className="text-muted-foreground">{item.status}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                )}

                {subscriptionStatuses.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Subscriptions</h4>
                    {subscriptionStatuses.map((item) => (
                      <div key={`subscription-${item.status}`} className="flex items-center justify-between rounded border p-2 text-sm">
                        <span className="text-muted-foreground">{item.status}</span>
                        <span className="font-medium">{item.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No status breakdown data available from the backend.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent transactions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-2">Date</th>
                    <th className="pb-2 pr-2">User</th>
                    <th className="pb-2 pr-2">Type</th>
                    <th className="pb-2 pr-2">Status</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={`${tx.type}-${tx.id}`} className="border-b last:border-b-0">
                      <td className="py-2 pr-2">{format(new Date(tx.createdAt), "dd MMM yyyy, hh:mm a")}</td>
                      <td className="py-2 pr-2">{tx.user?.name || tx.user?.email || "-"}</td>
                      <td className="py-2 pr-2">
                        <div className="flex items-center gap-2">
                          <span>{tx.type}</span>
                          {tx.purchaseType && <Badge variant="outline">{tx.purchaseType}</Badge>}
                        </div>
                      </td>
                      <td className="py-2 pr-2">{tx.status}</td>
                      <td className="py-2 text-right font-medium">{formatCurrency(Number(tx.amount || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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