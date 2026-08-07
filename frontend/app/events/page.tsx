"use client";

import { useEffect, useState } from "react";

import { EventResponse } from "@/app/models/EventResponse";
import {getPreviousEvents, getUpcomingEvents} from "@/app/service/eventService";
import EventCard from "@/app/components/events/EventCard";

export default function Page() {

    const [upcomingEvents, setUpcomingEvents] = useState<EventResponse[]>([]);
    const [previousEvents, setPreviousEvents] = useState<EventResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const upcomingEventData = await getUpcomingEvents(3);
                const previousEventData = await getPreviousEvents();

                setUpcomingEvents(upcomingEventData);
                setPreviousEvents(previousEventData);
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
                {upcomingEvents.map((event) => (
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

            <h1 className="text-center text-4xl pt-5">
                Previous Events
            </h1>


            <div className="flex flex-wrap justify-center gap-6 pt-4 max-w-7xl mx-auto">
                {previousEvents.map((event) => (
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