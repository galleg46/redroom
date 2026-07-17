import { EventResponse } from "@/app/models/EventResponse";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function getAllEvents(): Promise<EventResponse[]> {
    const response = await fetch(`${API_URL}/events`);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

export async function getUpcomingEvents(numberOfEvents: number ): Promise<EventResponse[]> {
    const response = await fetch(`${API_URL}/events/upcoming?numberOfEvents=${numberOfEvents}`);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

export class EventService {}