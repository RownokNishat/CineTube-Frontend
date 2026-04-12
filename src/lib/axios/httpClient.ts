/* eslint-disable @typescript-eslint/no-explicit-any */
import { getNewTokensWithRefreshToken } from '@/services/auth.services';
import { ApiResponse } from '@/types/api.types';
import axios from 'axios';
import { isDynamicServerUsageError } from '../isDynamicServerUsageError';
import { isTokenExpiringSoon } from '../tokenUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined in environment variables');
}

const shouldLogHttpClientError = (error: unknown): boolean => {
    if (isDynamicServerUsageError(error)) {
        return false;
    }

    if (
        typeof window === 'undefined'
        && axios.isAxiosError(error)
        && ["ECONNREFUSED", "ECONNRESET", "ENOTFOUND", "ETIMEDOUT"].includes(error.code ?? "")
    ) {
        return false;
    }

    return true;
};

async function tryRefreshToken(
    accessToken: string,
    refreshToken: string
): Promise<void>
{
    if(!(await isTokenExpiringSoon(accessToken))) {
        return;
    }

    let requestHeader: Awaited<ReturnType<(typeof import('next/headers'))['headers']>>;

    try {
        const { headers } = await import('next/headers');
        requestHeader = await headers();
    } catch (error) {
        if (isDynamicServerUsageError(error)) {
            return;
        }

        throw error;
    }

    if (requestHeader.get("x-token-refreshed") === "1") {
        return; // avoid multiple refresh attempts in the same request lifecycle
    }

    try {
        await getNewTokensWithRefreshToken(refreshToken);
    } catch (error : any) {
        console.error("Error refreshing token in http client:", error);
    }
}

const axiosInstance = async () => {
    // Browser environment: cookies are sent automatically by the browser
    if (typeof window !== 'undefined') {
        return axios.create({
            // Use same-origin proxy so HttpOnly cookies set by Next are forwarded to backend.
            baseURL: '/api/v1',
            timeout: 30000,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        });
    }

    // Server environment: manually forward cookies from the incoming request
    let cookieHeader = "";

    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

        if(accessToken && refreshToken){
            await tryRefreshToken(accessToken, refreshToken);
        }

        cookieHeader = cookieStore
            .getAll()
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join("; ");
    } catch (error) {
        if (!isDynamicServerUsageError(error)) {
            throw error;
        }
    }

    const instance = axios.create({
        baseURL : API_BASE_URL,
        timeout : 30000,
        headers:{
            'Content-Type' : 'application/json',
            ...(cookieHeader ? { Cookie : cookieHeader } : {})
        }
    })

    return instance;
}

export interface ApiRequestOptions {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
}

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {     
        const instance = await axiosInstance();   
        const response = await instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {       
        if (shouldLogHttpClientError(error)) {
            console.error(`GET request to ${endpoint} failed:`, error);
        }

        throw error;
    }
}

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        if (shouldLogHttpClientError(error)) {
            console.error(`POST request to ${endpoint} failed:`, error);
        }

        throw error;
    }
}

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        if (shouldLogHttpClientError(error)) {
            console.error(`PUT request to ${endpoint} failed:`, error);
        }

        throw error;
    }
}

const httpPatch = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    }
    catch (error) {
        if (shouldLogHttpClientError(error)) {
            console.error(`PATCH request to ${endpoint} failed:`, error);
        }

        throw error;
    }
}

const httpDelete =  async <TData>(endpoint: string, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        if (shouldLogHttpClientError(error)) {
            console.error(`DELETE request to ${endpoint} failed:`, error);
        }

        throw error;
    }
}

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
}