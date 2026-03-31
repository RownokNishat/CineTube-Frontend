type MaybeDynamicServerError = {
    digest?: string;
    description?: string;
};

export const isDynamicServerUsageError = (error: unknown): boolean => {
    if (!error || typeof error !== "object") {
        return false;
    }

    const { digest, description } = error as MaybeDynamicServerError;

    return (
        digest === "DYNAMIC_SERVER_USAGE"
        || description?.includes("Dynamic server usage") === true
        || description?.includes("used `cookies`") === true
        || description?.includes("used `headers`") === true
    );
};