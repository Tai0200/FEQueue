export const fetchWithTokenRetry = async (url: string, options: RequestInit = {}): Promise<any> => {
    const token = localStorage.getItem("token") ?? '';
    const defaultHeaders: Record<string, string> = {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
    };

    if (!(options.body instanceof FormData)) {
        defaultHeaders["Content-Type"] = "application/json";
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...(options.headers as Record<string, string> || {})
            },
            credentials: 'include'
        });

        if (response.status === 401) {
            console.log("Token expired, refreshing...");
            const isRefreshed = await refreshToken();
            if (isRefreshed) {
                return await fetchWithTokenRetry(url, options);
            } else {
                await callLogout();
                localStorage.clear();
                window.location.href = '/login';
                return response;
            }
        }
        return response;
    } catch (error) {
        console.error("Network or CORS error:", error);
        throw error;
    }
}
async function refreshToken() {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await fetch(process.env.REACT_APP_API_URL + 'api/Authenticate/refresh', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(refreshToken), // Send refresh token
        });
        if (!response.ok) {
            console.error("Failed to refresh token:", response.status);
            return false; // Return false if refreshing token fails
        }
        const { access_Token, refresh_Token } = await response.json();
        // Save new tokens to localStorage
        localStorage.setItem("token", access_Token);
        localStorage.setItem("refreshToken", refresh_Token);
        console.log("Token refreshed successfully");
        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false; // Return false if an error occurs
    }
}

async function callLogout() {
    try {
        const userName = localStorage.getItem("userName");
        const response = await fetch(process.env.REACT_APP_API_URL + 'api/Authenticate/logout/' + userName, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
            console.error("Failed to refresh token:", response.status);
            return false; // Return false if refreshing token fails
        }
        return true;

    } catch (error) {
        console.error("Error refreshing token:", error);
        return false; // Return false if an error occurs
    }
}

