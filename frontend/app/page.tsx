"use client";

import {useEffect, useState} from "react";

import { EventResponse } from "@/app/models/EventResponse";
import { getUpcomingEvents } from "@/app/service/eventService";
import { CustomButton } from "@/app/components/ui/CustomButton";
import EventCard from "@/app/components/events/EventCard"

export default function HomePage() {

    const [events, setEvents] = useState<EventResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await getUpcomingEvents(1);
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
      <main className="flex min-h-screen flex-col p-6">
          <div className="flex flex-col items-center justify-center">

              <h1 className="text-center text-4xl pb-3">
                  Next up...
              </h1>

              <div className="pt-4 max-w-7xl mx-auto">
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

              <p>First Time attending an event at Red Room? Please fill out the waiver below.</p>
              <div className="mt-4">
                  <CustomButton variant="contained" href="/waiver">Waiver</CustomButton>
              </div>
          </div>
      </main>
  );
}