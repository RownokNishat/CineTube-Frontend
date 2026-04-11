"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const barData = [
    { name: "Jan", users: 400, media: 240, revenue: 2400 },
    { name: "Feb", users: 300, media: 139, revenue: 2210 },
    { name: "Mar", users: 200, media: 980, revenue: 2290 },
    { name: "Apr", users: 278, media: 390, revenue: 2000 },
    { name: "May", users: 189, media: 480, revenue: 2181 },
    { name: "Jun", users: 239, media: 380, revenue: 2500 },
];

const pieData = [
  { name: 'Movies', value: 1200 },
  { name: 'Series', value: 850 },
  { name: 'Free', value: 700 },
  { name: 'Premium', value: 1350 },
];

const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042'];

export default function AdminCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Platform Growth Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                            <Legend />
                            <Bar dataKey="users" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="revenue" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Media Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
