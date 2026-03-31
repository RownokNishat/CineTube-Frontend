/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IAdminDashboardData } from "@/types/dashboard.types";

export async function getDashboardData() {
    const candidateEndpoints = [
      "/stats",
      "/dashboard/stats",
      "/admin/stats",
      "/admin/dashboard/stats",
      "/analytics/stats",
    ];

    let lastError: any = null;

    for (const endpoint of candidateEndpoints) {
      try {
        const response = await httpClient.get<IAdminDashboardData>(endpoint);
        if (response?.success) {
          return response;
        }
      } catch (error: any) {
        lastError = error;

        const statusCode =
          error &&
          typeof error === "object" &&
          "response" in error &&
          error.response &&
          typeof error.response === "object" &&
          "status" in error.response
            ? error.response.status
            : undefined;

        // Try the next endpoint only for not-found; otherwise fail fast.
        if (statusCode !== 404) {
          break;
        }
      }
    }

    console.log(lastError, "From Dashboard Server Action");
    return {
      success: false,
      message: lastError?.message || "An error occurred while fetching dashboard data.",
      data: null,
      meta: null,
    };
}