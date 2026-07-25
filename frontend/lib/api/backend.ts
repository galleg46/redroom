import {auth0} from "@/lib/auth0";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type BackendFetchOptions = RequestInit & {
    authenticated?: boolean;
};

export async function backendFetch(endpoint: string, options: BackendFetchOptions) {
    const { authenticated = false, ...init } = options;
    const headers = new Headers(init.headers);

    if (authenticated) {
        const token = await auth0.getAccessToken();
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_URL}${endpoint}`, {
        ...init,
        headers
    });
}