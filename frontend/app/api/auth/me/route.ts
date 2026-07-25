import { backendFetch } from "@/lib/api/backend";

export async function GET() {
    const response = await backendFetch("/api/auth/me", {
        authenticated: true,
    });

    return Response.json(await response.json(), {
        status: response.status,
    });
}