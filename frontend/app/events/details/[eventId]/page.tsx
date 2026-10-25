import { getEventById } from "@/app/service/eventService";
import {Box, Grid, Paper, Stack, Typography} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {CustomButton} from "@/app/components/ui/CustomButton";
import sanitizeHtml from "sanitize-html";

type Props = {
    params: Promise<{
        eventId: number;
    }>;
};

export default async function Page({ params }: Props) {
    const { eventId } = await params;

    const event = await getEventById(eventId);

    const cutoff = new Date(event.eventDate);
    cutoff.setDate(cutoff.getDate() + 1);
    cutoff.setHours(5, 0, 0, 0);

    const isEventFinished = new Date() >= cutoff;

    return (
            <Box sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: 6,
                paddingBottom: 6
            }}
            >
                <Paper elevation={0}
                       sx={{
                           color: "white",
                           backgroundColor: "black",
                           border: 8,
                           borderColor: "black",
                       }}
                >
                    <Grid container spacing={4} sx={{ paddingLeft: 1}}>
                        <Grid size={{ xs:12, md:5 }}>
                            <Stack direction="column" spacing={4}>
                                <Typography variant="h3">
                                    {event.eventName}
                                </Typography>

                                <Typography>
                                    {new Date(event.eventDate).toLocaleDateString("en-US", {weekday: "long", month: "long", day: "2-digit"})}
                                </Typography>

                                <Typography variant="body1">
                                    <AccessTimeIcon/>
                                    {" "}Show start:{" "}{new Date(event.eventDate).toLocaleTimeString("en-US", {hour: "2-digit"})}{" // "}{event.ageRequirement}
                                </Typography>

                                <Typography variant="body1">
                                    {event.eventLineup.join(", ")}
                                </Typography>

                                <Box
                                    sx={{
                                        overflowWrap: "anywhere",
                                        "& p": {
                                            marginTop: 0,
                                            marginBottom: "1em",
                                            minHeight: "1.7em",
                                        },
                                        // Preserve empty paragraphs created by pressing Enter.
                                        "& p:empty": {
                                            minHeight: "1.7em",
                                            marginBottom: "1em",
                                        },
                                        // Preserve Shift + Enter line breaks.
                                        "& br": {
                                            display: "block",
                                            content: '""',
                                            marginTop: "0.5em",
                                        },
                                        "& h2": { fontSize: "1.5rem", mt: 2, mb: 1 },
                                        "& h3": { fontSize: "1.2rem", mt: 2, mb: 1 },
                                        "& ul, & ol": { pl: 3 },
                                        "& blockquote": {
                                            borderLeft: "3px solid #b91c1c",
                                            pl: 2,
                                            ml: 0,
                                            color: "grey.400",
                                        },
                                        "& a": { color: "#f87171" },
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: sanitizeHtml(event.eventDescription ?? "", {
                                            allowedTags: [
                                                "p", "br", "strong", "b", "em", "i", "s",
                                                "h2", "h3", "ul", "ol", "li", "blockquote", "a",
                                            ],
                                            allowedAttributes: {
                                                a: ["href", "target", "rel"],
                                            },
                                            allowedSchemes: ["http", "https", "mailto"],
                                        }),
                                    }}>
                                </Box>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs:12, md:7 }} sx={{ paddingTop: 1, }}>
                            <Stack spacing={1}>
                                <Box component="img"
                                     src={`data:${event.flyerContentType};base64,${event.flyer}`}
                                     sx={{
                                         width: "100%",
                                         maxHeight: 600,
                                         objectFit: "contain"
                                     }}
                                />
                                {(!isEventFinished && !!event.ticketLink) && (
                                    <CustomButton variant="contained" href={event.ticketLink} sx={{ alignSelf: "center", width: "100%", maxWidth: 480}}>
                                        Buy Tickets
                                    </CustomButton>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
    );
}