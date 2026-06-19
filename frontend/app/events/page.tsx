"use client";

import { useEffect, useState } from "react";

import { EventResponse } from "@/app/models/EventResponse";
import { getUpcomingEvents } from "@/app/service/eventService";
import {Card, CardContent, CardMedia, Typography} from "@mui/material";

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
            <div className="bg-black flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="bg-black flex min-h-screen flex-col p-6">

            <h1 className="text-center text-4xl pb-3">
                Upcoming Events
            </h1>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 max-w-7xl mx-auto">
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

        </div>

    );
}