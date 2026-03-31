/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAdminDashboardData } from "@/types/dashboard.types";

export async function getDashboardData() {
    try {
      return await httpClient.get<IAdminDashboardData>("/admin/payments/dashboard");
    } catch (error: any) {
      console.log(error, "From Dashboard Server Action");
      return {
        success: false,
        message: error?.message || "An error occurred while fetching dashboard data.",
        data: null,
        meta: null,
      };
    }
}