

import { getEventById } from "@/app/service/eventService";
import {Box, Grid, Paper, Stack, Typography} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {CustomButton} from "@/app/components/ui/CustomButton";

type Props = {
    params: Promise<{
        eventId: number;
    }>;
};

export default async function Page({ params }: Props) {
    const { eventId } = await params;

    const event = await getEventById(eventId);

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
                <Paper elevation={2}
                       sx={{
                           color: "white",
                           backgroundColor: "black",
                           border: 8,
                           borderColor: "black",
                       }}
                >
                    <Grid container spacing={4} sx={{ paddingLeft: 1}}>
                        <Grid size={{ xs:12, md:5 }}>
                            <Stack direction="column" spacing={2}>
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
                                    {event.eventLineup}
                                </Typography>

                                <Typography>
                                    {event.eventDescription}
                                </Typography>
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

                                <CustomButton variant="contained" href="" sx={{ alignSelf: "center", width: "100%", maxWidth: 480}}>
                                    Buy Tickets
                                </CustomButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
    );
}