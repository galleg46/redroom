"use client";

import { useEffect, useState } from "react";

import { EventResponse } from "@/app/models/EventResponse";
import { getUpcomingEvents } from "@/app/service/eventService";
import EventCard from "@/app/components/events/EventCard";

export default function Page() {

    const [events, setEvents] = useState<EventResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await getUpcomingEvents(3);
                setEvents(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">

            <h1 className="text-center text-4xl pt-5">
                Upcoming Events
            </h1>


            <div className="flex flex-wrap justify-center gap-6 pt-4 max-w-7xl mx-auto">
                {events.map((event) => (
                    <EventCard key={event.id}
                               id={event.id}
                               eventName={event.eventName}
                               eventDate={event.eventDate}
                               eventLineup={event.eventLineup}
                               genres={event.genres}
                               eventDescription={event.eventDescription}
                               eventPromoter={event.eventPromoter}
                               ageRequirement={event.ageRequirement}
                               flyer={event.flyer}
                               flyerContentType={event.flyerContentType}
                    />
                ))}
            </div>

        </div>

    );
}