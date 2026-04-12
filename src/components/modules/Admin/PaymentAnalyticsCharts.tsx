"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const PAYMENT_COLORS = ["#0f766e", "#2563eb", "#f59e0b", "#dc2626"];

interface PaymentAnalyticsChartsProps {
    trend: Array<{
        label: string;
        count: number;
        revenue: number;
    }>;
    paymentTypeChartData: Array<{
        name: string;
        value: number;
    }>;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(value);

const PaymentAnalyticsCharts = ({ trend, paymentTypeChartData }: PaymentAnalyticsChartsProps) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Payment Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    {trend.length > 0 ? (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trend}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip formatter={(value, name) => name === "Revenue" ? formatCurrency(Number(value)) : Number(value).toLocaleString()} />
                                    <Legend />
                                    <Bar dataKey="count" name="Payments" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="revenue" name="Revenue" fill="#0f766e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No monthly payment analytics available from the backend.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Revenue by Payment Type</CardTitle>
                </CardHeader>
                <CardContent>
                    {paymentTypeChartData.length > 0 ? (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={paymentTypeChartData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={90} paddingAngle={4}>
                                        {paymentTypeChartData.map((entry, index) => (
                                            <Cell key={`payment-type-${entry.name}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No payment type breakdown is available yet.</p>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default PaymentAnalyticsCharts;