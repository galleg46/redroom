import { EventAttendee } from "@/app/models/EventAttendee";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function getAllAttendees(): Promise<EventAttendee[]>  {
    const response = await fetch(`${API_URL}/waiver`);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}