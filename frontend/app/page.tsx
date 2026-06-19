"use client";

import {useEffect, useState} from "react";

import { EventResponse } from "@/app/models/EventResponse";
import { getUpcomingEvents } from "@/app/service/eventService";
import { CustomButton } from "@/app/components/ui/CustomButton";
import {Card, CardContent, CardMedia, Typography} from "@mui/material";

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
            <div className="bg-black flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

  return (
      <main className="bg-black flex min-h-screen flex-col p-6">
          <div className="flex flex-col items-center justify-center">

              <h1 className="text-center text-4xl pb-3">
                  Next up...
              </h1>


              <div className="pt-4 max-w-7xl mx-auto">
                  {events.map((event) => (
                      <Card key={event.id} sx={{ backgroundColor: "black" }}>
                          <CardMedia component="img"
                                     sx={{
                                         height: 425,
                                         objectFit: "cover",
                                     }}
                                     image={`data:${event.flyerContentType};base64,${event.flyer}`}
                          />
                          <CardContent>
                              <Typography variant="h6" sx={{ color: "white" }}>
                                  {new Date(event.eventDate).toLocaleDateString("en-US", {weekday: "short", month: "long", day: "2-digit"})}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "white" }}>
                                  {event.eventLineup}
                              </Typography>
                          </CardContent>
                      </Card>
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