import { backendFetch } from "@/lib/api/backend";

export async function GET() {
    const response =  await backendFetch("/events",{});

    return new Response(response.body, {
        status: response.status,
        headers: response.headers,
    });
}