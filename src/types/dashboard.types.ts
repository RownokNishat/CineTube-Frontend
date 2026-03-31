export interface NavItem {
    title : string,
    href : string,
    icon : string
}

export interface NavSection {
    title ?: string,
    items : NavItem[]
}

export interface PieChartData {
    status: string,
    count: number
}

export interface BarChartData {
    month?: Date | string,
    day?: Date | string,
    count: number,
    revenue?: number
}

export interface PaymentOverview {
    periodDays: number;
    paymentCount: number;
    userCount: number;
    purchaseRevenue: number;
    subscriptionRevenue: number;
    rentalRevenue: number;
    totalRevenue: number;
}

export interface PaymentDashboardData {
    paymentCount?: number;
    userCount?: number;
    totalRevenue?: number;
    barChartData: BarChartData[];
    pieChartData?: PieChartData[];
    overview?: PaymentOverview;
    topMedia?: Array<{
        mediaId: string;
        title: string;
        purchases: number;
        revenue: number;
    }>;
    purchaseStatusBreakdown?: PieChartData[];
    subscriptionStatusBreakdown?: PieChartData[];
}

export interface PaymentTransaction {
    id: string;
    type: "PURCHASE" | "SUBSCRIPTION";
    status: string;
    amount: number;
    currency: string;
    createdAt: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    media?: {
        id: string;
        title: string;
    };
    plan?: string;
    purchaseType?: "PURCHASE" | "RENTAL";
}

export interface IAdminDashboardData {
    appointmentCount : number;
    patientCount : number;
    doctorCount : number;
    adminCount : number;
    superAdminCount : number;
    paymentCount : number;
    userCount : number;
    totalRevenue : number;
    barChartData : BarChartData[];
    pieChartData : PieChartData[];
}
