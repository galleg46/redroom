import {Card, CardContent, CardMedia, Typography, Stack} from "@mui/material";
import Link from "next/link";
import { EventResponse } from "@/app/models/EventResponse";
import {CustomButton} from "@/app/components/ui/CustomButton";

export default function EventCard(props: EventResponse) {

    const cutoff = new Date(props.eventDate);
    cutoff.setDate(cutoff.getDate() + 1);
    cutoff.setHours(5, 0, 0, 0);

    const isEventFinished = new Date() >= cutoff;

    return (
        <Card key={props.id} sx={{ backgroundColor: "black" }}>
            <CardMedia component="img"
                       sx={{
                           height: 425,
                           objectFit: "cover",
                       }}
                       image={`data:${props.flyerContentType};base64,${props.flyer}`}
            />
            <CardContent>
                <Typography variant="h6" sx={{ color: "white" }}>
                    {new Date(props.eventDate).toLocaleDateString("en-US", {weekday: "short", month: "long", day: "2-digit"})}
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                    {props.eventLineup}
                </Typography>
            </CardContent>
            <Stack direction="row" spacing={2} sx={{ px: 3, pb: 2, justifyContent: "center" }}>
                {!isEventFinished && (
                    <CustomButton>
                        Buy Tickets
                    </CustomButton>
                )}
                <Link href={`/events/details/${props.id}`}>
                    <CustomButton>More Info</CustomButton>
                </Link>
            </Stack>
        </Card>
    );
}
