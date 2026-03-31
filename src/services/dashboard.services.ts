/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { PaymentDashboardData, PaymentTransaction } from "@/types/dashboard.types";

interface PaymentTransactionQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  type?: "PURCHASE" | "SUBSCRIPTION";
  status?: string;
}

export async function getPaymentDashboardData(periodDays = 30) {
    try {
      return await httpClient.get<PaymentDashboardData>("/admin/payments/dashboard", {
        params: { periodDays },
      });
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

export async function getPaymentTransactions({
  page = 1,
  limit = 20,
  searchTerm,
  type,
  status,
}: PaymentTransactionQueryParams = {}) {
  try {
    return await httpClient.get<PaymentTransaction[]>("/admin/payments/transactions", {
      params: { page, limit, searchTerm, type, status },
    });
  } catch (error: any) {
    console.log(error, "From Payment Transactions Server Action");
    return {
      success: false,
      message: error?.message || "An error occurred while fetching payment transactions.",
      data: [],
      meta: null,
    };
  }
}

export async function getDashboardData() {
  return getPaymentDashboardData();
}