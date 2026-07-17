"use client";

import { ChangeEvent, useEffect, useState} from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Stack,
    IconButton, Fab,
    Dialog, CardMedia, CardContent, Typography, Card, DialogContent, Autocomplete, RadioGroup, FormControl,
    FormLabel, FormControlLabel,
    Radio, Box, Grid, Snackbar, Alert
} from "@mui/material";
import {
    DatePicker,
    LocalizationProvider,
    renderDigitalClockTimeView,
    TimePicker
} from "@mui/x-date-pickers"
import CloseIcon from "@mui/icons-material/Close";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Add, CloudUpload, DeleteOutlined, EditOutlined, VisibilityOutlined } from "@mui/icons-material";

import { EventResponse } from "@/app/models/EventResponse";
import { getAllEvents } from "@/app/service/eventService";
import {CustomTextField} from "@/app/components/ui/CustomTextField";
import {CustomButton} from "@/app/components/ui/CustomButton";
import dayjs, { Dayjs } from "dayjs";

const createEventSchema = z.object({
    eventName: z.string().min(1, "Event Name is required"),
    eventPromoter: z.string().optional(),
    eventLineup: z.array(z.string()).optional(),
    eventGenres: z.array(z.string()).optional(),
    eventDescription: z.string().optional(),
    eventDate: z.custom<Dayjs | null>(),
    eventTime: z.custom<Dayjs | null>(),
    ageRequirement: z.string().optional(),
    flyer: z.file().max(10 * 1024 * 1024).refine(file => file.type.startsWith("image/"), "File must be an image").optional()
})

export default function Page() {
    const {
        control,
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            eventName: "",
            eventPromoter: "",
            eventLineup: [],
            eventGenres: [],
            eventDescription: "",
            eventDate: null,
            eventTime: null
        }
    });

    const [events, setEvents] = useState<EventResponse[]>([]);
    const [editingEvent, setEditingEvent] = useState<EventResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [previewEvent, setPreviewEvent] = useState<EventResponse | null>(null);
    const [dialogOpened, setDialogOpened] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "warning" | "info">("info");
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await getAllEvents();
            setEvents(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEventPreview = (existingEvent: EventResponse) => {
        setPreviewEvent(existingEvent);
    }

    const handlePreviewClose = () => {
        setPreviewEvent(null);
    }

    const handleOpenDialog = () => {
        setDialogOpened(true);
    }

    const handleOpenCreateDialog = () => {
        setEditingEvent(null);

        reset({
            eventName: "",
            eventPromoter: "",
            eventLineup: [],
            eventGenres: [],
            eventDescription: "",
            eventDate: null,
            eventTime: null,
            ageRequirement: "21+"
        });

        setImagePreviewUrl(null);
        handleOpenDialog();
    };

    const handleDialogClose = () => {
        setDialogOpened(false);
        setEditingEvent(null);

        reset({
            eventName: "",
            eventPromoter: "",
            eventLineup: [],
            eventGenres: [],
            eventDescription: "",
            eventDate: null,
            eventTime: null,
            ageRequirement: "21+"
        });

        setImagePreviewUrl(null);
    }

    const handleEditEvent = (event: EventResponse) => {
        setEditingEvent(event);

        reset({
            eventName: event.eventName,
            eventPromoter: event.eventPromoter ?? "",
            eventLineup: event.eventLineup ?? [],
            eventGenres: event.genres ?? [],
            eventDescription: event.eventDescription ?? "",
            eventDate: dayjs(event.eventDate),
            eventTime: dayjs(event.eventDate),
            ageRequirement: event.ageRequirement
        });

        setImagePreviewUrl(
            event.flyer
                ? `data:${event.flyerContentType};base64,${event.flyer}`
                : null
        );

        handleOpenDialog();
    }

    const showAlert = (
        message: string,
        severity: "success" | "error" | "warning" | "info") => {

            setAlertMessage(message);
            setAlertSeverity(severity);
            setAlertOpen(true);

    }

    const createNewEvent = async (newEvent: any) => {
        const dateTime = newEvent.eventDate.hour(newEvent.eventTime.hour()).minute(newEvent.eventTime.minute());

        const formData = new FormData();

        formData.append("eventName", newEvent.eventName);
        formData.append("eventDate", dateTime.format("YYYY-MM-DDTHH:mm:ss"));
        formData.append("eventDescription", newEvent.eventDescription);
        newEvent.eventLineup.forEach((artist: string) => {
            formData.append("EventLineup", artist);
        });
        formData.append("eventPromoter", newEvent.eventPromoter);
        newEvent.eventGenres?.forEach((genre: string) =>
            formData.append("Genres", genre)
        );
        formData.append("ageRequirement", newEvent.ageRequirement);
        formData.append("flyer", newEvent.flyer);

        try {
            const response = await fetch(`${API_URL}/events`, {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                showAlert(
                    "Event created successfully!",
                    "success"
                );

                await loadEvents();

                handleDialogClose();
                return;
            }

            switch (response.status) {

                case 400:
                    showAlert(
                        "Malformed data, please check your form entries.",
                        "error"
                    );
                    break;

                case 429:
                    showAlert(
                        "Too many requests. Please try again later.",
                        "warning"
                    );
                    break;

                default:

                    if (response.status >= 500) {
                        showAlert(
                            "Server error. Please try again later.",
                            "error"
                        );

                    } else {
                        showAlert(
                            "Something went wrong.",
                            "error"
                        );
                    }
            }

        } catch (error) {
            console.log("An Error occurred while creating an event.", error);

            showAlert(
                "Unable to connect to the server.",
                "error"
            );
        }

    }

    const deleteEvent = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/events/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                showAlert(
                    "Event deleted successfully.",
                    "success"
                );

                await loadEvents();

                return;
            }

            switch (response.status) {

                case 400:
                    showAlert(
                        "Event doesn't exist. Nothing could be deleted.",
                        "error"
                    );
                    break;

                case 429:
                    showAlert(
                        "Too many requests. Please try again later.",
                        "warning"
                    );
                    break;

                default:

                    if (response.status >= 500) {
                        showAlert(
                            "Server error. Please try again later.",
                            "error"
                        );

                    } else {
                        showAlert(
                            "Something went wrong.",
                            "error"
                        );
                    }
            }
        } catch (error) {
            console.log("An Error occurred while deleting an event.", error);

            showAlert(
                "Unable to connect to the server.",
                "error"
            );
        }
    }

    const updateEvent = async (existingEvent: any) => {
        const dateTime = existingEvent.eventDate.hour(existingEvent.eventTime.hour()).minute(existingEvent.eventTime.minute());

        if (editingEvent == null) {
            showAlert("An Error occurred when editing the event",
                "error"
            );

            return;
        }

        const formData = new FormData();

        formData.append("eventName", existingEvent.eventName);
        formData.append("eventDate", dateTime.format("YYYY-MM-DDTHH:mm:ss"));
        formData.append("eventDescription", existingEvent.eventDescription);
        existingEvent.eventLineup.forEach((artist: string) => {
            formData.append("EventLineup", artist);
        });
        formData.append("eventPromoter", existingEvent.eventPromoter);
        existingEvent.eventGenres?.forEach((genre: string) =>
            formData.append("Genres", genre)
        );
        formData.append("ageRequirement", existingEvent.ageRequirement);

        if (existingEvent.flyer instanceof File) {
            formData.append("flyer", existingEvent.flyer);
        }

        try {
            const response = await fetch(`${API_URL}/events/${editingEvent.id}`, {
                method: "PUT",
                body: formData
            });

            if (response.ok) {
                showAlert(
                    "Event updated successfully.",
                    "success"
                );

                await loadEvents();
                handleDialogClose();
                return;
            }

            switch (response.status) {

                case 400:
                    showAlert(
                        "Event doesn't exist. Nothing could be updated.",
                        "error"
                    );
                    break;

                case 429:
                    showAlert(
                        "Too many requests. Please try again later.",
                        "warning"
                    );
                    break;

                default:

                    if (response.status >= 500) {
                        showAlert(
                            "Server error. Please try again later.",
                            "error"
                        );

                    } else {
                        showAlert(
                            "Something went wrong.",
                            "error"
                        );
                    }
            }
        } catch (error) {
            console.log("An Error occurred while deleting an event.", error);

            showAlert(
                "Unable to connect to the server.",
                "error"
            );
        }
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setValue("flyer", file, {
            shouldValidate: true,
            shouldDirty: true
        });

        setImagePreviewUrl(URL.createObjectURL(file));
    }


    if (loading) {
        return (
            <div className="bg-black flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    return(
        <div className="bg-black flex min-h-screen flex-col p-6">
            <h1 className="text-center text-4xl pb-3">
                Event Dashboard
            </h1>

            <Snackbar open={alertOpen}
                      autoHideDuration={5000}
                      onClose={() => setAlertOpen(false)}
                      anchorOrigin={{
                          vertical: "top",
                          horizontal: "center"
                      }}
            >
                <Alert className="max-w-fit text-center"
                       severity={alertSeverity}
                       action={
                           <IconButton
                               aria-label="close"
                               color="inherit"
                               size="small"
                               onClick={() => setAlertOpen(false)}
                           >
                               <CloseIcon fontSize="inherit"/>
                           </IconButton>
                       }
                >
                    {alertMessage}
                </Alert>
            </Snackbar>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650,
                             backgroundColor: "black",
                                "& .MuiTableCell-root": {
                                    color: "white",
                                    borderColor: "#333",
                                }
                             }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Date & Time</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Lineup</TableCell>
                            <TableCell align="center">Promoter</TableCell>
                            <TableCell align="center">Genre(s)</TableCell>
                            <TableCell align="center">Age Requirement</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell align="center">{event.eventName}</TableCell>
                                <TableCell align="center">{new Date(event.eventDate).toLocaleString()}</TableCell>
                                <TableCell align="center">{event.eventDescription}</TableCell>
                                <TableCell align="center">{event.eventLineup.join(", ")}</TableCell>
                                <TableCell align="center">{event.eventPromoter}</TableCell>
                                <TableCell align="center">{event.genres.join(", ")}</TableCell>
                                <TableCell align="center">{event.ageRequirement}</TableCell>
                                <TableCell align="center">
                                    <Stack direction="row">
                                        <IconButton sx={{ color: "red"}}>
                                            <VisibilityOutlined onClick={() => handleEventPreview(event)}/>
                                        </IconButton>
                                        <IconButton sx={{ color: "red"}}
                                                    onClick={() => handleEditEvent(event)}
                                        >
                                            <EditOutlined/>
                                        </IconButton>
                                        <IconButton sx={{ color: "red"}}
                                                    onClick={() => deleteEvent(event.id)}
                                        >
                                            <DeleteOutlined/>
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={previewEvent != null}
                onClose={handlePreviewClose}
            >
                {previewEvent && (
                    <Card sx={{ backgroundColor: "black" }}>
                        <CardMedia
                            component="img"
                            sx={{
                                height: 425,
                                objectFit: "cover",
                            }}
                            image={`data:${previewEvent.flyerContentType};base64,${previewEvent.flyer}`}
                        />

                        <CardContent>
                            <Typography variant="h6" sx={{ color: "white" }}>
                                {new Date(previewEvent.eventDate).toLocaleDateString(
                                    "en-US",
                                    {
                                        weekday: "short",
                                        month: "long",
                                        day: "2-digit"
                                    }
                                )}
                            </Typography>

                            <Typography variant="body2" sx={{ color: "white" }}>
                                {previewEvent.eventLineup.join(", ")}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Dialog>

            {/* Start of Create Event dialog */}
            <Fab  onClick={handleOpenCreateDialog} sx={{ position: "fixed", bottom: 24, right: 24, color: "black", backgroundColor: "red"}}>
                <Add />
            </Fab>
            <Dialog open={dialogOpened}
                    onClose={handleDialogClose}
                    maxWidth="lg"
                    fullWidth
                    slotProps={{
                        paper:{
                            sx: {
                                backgroundColor: "#16181C",
                            }
                        }
                    }}
            >
                <DialogContent  sx={{ backgroundColor: "#16181C", color: "white"}}>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 4}}  sx={{ paddingTop: 4}} >
                            <Box
                                component="label"
                                sx={{
                                    width: 290,
                                    height: 375,
                                    border: imagePreviewUrl ? "none" : "2px dashed #666",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    overflow: "hidden",
                                    color: "#111"
                                }}
                            >
                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />

                                {!imagePreviewUrl ? (
                                    <Stack sx={{ alignItems: "center", justifyContent: "center"}}>
                                        <CloudUpload
                                            sx={{fontSize: 48, color: "#888"}}
                                        />
                                        <Typography sx={{ color: "#aaa"}}>
                                            Upload Flyer
                                        </Typography>
                                    </Stack>
                                ) : (
                                    <img
                                        src={imagePreviewUrl}
                                        alt="Flyer Preview"
                                        style={{
                                            height: 425,
                                            objectFit: "contain"
                                        }}
                                    />
                                )}
                            </Box>

                            {errors.flyer && (
                                <Typography color="error">
                                    {errors.flyer?.message}
                                </Typography>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12, md: 4}}  sx={{ paddingTop: 4}}>
                            <Stack spacing={2}>
                                <CustomTextField
                                    label="Event Name"
                                    {...register("eventName")}
                                    variant="outlined"
                                    required
                                />

                                <CustomTextField
                                    label="Event Promoter"
                                    {...register("eventPromoter")}
                                    variant="outlined"
                                />

                                <Controller name="eventLineup"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    multiple
                                                    freeSolo
                                                    options={[]}
                                                    value={field.value || []}
                                                    onChange={(_, newValue) => field.onChange(newValue)}
                                                    renderInput={(params) => (
                                                        <CustomTextField
                                                            {...params}
                                                            label="Lineup"
                                                            variant="outlined"
                                                            error={!!errors.eventLineup}
                                                            helperText={errors.eventLineup?.message}
                                                        />
                                                    )}
                                                    sx={{
                                                        "& .MuiChip-root": {
                                                            color: "#fff",
                                                            backgroundColor: "red"
                                                        },
                                                        "& .MuiChip-deleteIcon": {
                                                            color: "#fff !important",
                                                            opacity: 1
                                                        },
                                                        "& .MuiSvgIcon-root": {
                                                            color: "#fff"
                                                        }
                                                    }}
                                                />
                                            )}
                                />

                                <Controller name="eventGenres"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    multiple
                                                    freeSolo
                                                    options={[]}
                                                    value={field.value || []}
                                                    onChange={(_, newValue) => field.onChange(newValue)}
                                                    renderInput={(params) => (
                                                        <CustomTextField
                                                            {...params}
                                                            label="Genre(s)"
                                                            variant="outlined"
                                                            error={!!errors.eventGenres}
                                                            helperText={errors.eventGenres?.message}
                                                        />
                                                    )}
                                                    sx={{
                                                        "& .MuiChip-root": {
                                                            color: "#fff",
                                                            backgroundColor: "red"
                                                        },
                                                        "& .MuiChip-deleteIcon": {
                                                            color: "#fff !important",
                                                            opacity: 1
                                                        },
                                                        "& .MuiSvgIcon-root": {
                                                            color: "#fff"
                                                        }
                                                    }}
                                                />
                                            )}
                                            />

                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4}}  sx={{ paddingTop: 4}}>
                            <Stack spacing={2}>
                                <CustomTextField
                                    label="Description"
                                    {...register("eventDescription")}
                                    variant="outlined"
                                    multiline
                                    minRows={6}
                                />

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Controller name="eventDate"
                                                control={control}
                                                render={({ field }) =>  (
                                                    <DatePicker label="Date"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                slotProps={{
                                                                    textField: {
                                                                        error: !!errors.eventDate,
                                                                        helperText: errors.eventDate?.message,
                                                                        sx: {
                                                                            // Calendar icon
                                                                            "& .MuiSvgIcon-root": {
                                                                                //color: "#B2BAC2"
                                                                                color: "#aaa"
                                                                            },

                                                                            // Input container
                                                                            "& .MuiPickersOutlinedInput-root": {

                                                                                "&:hover fieldset": {
                                                                                    borderColor: "#aaa"
                                                                                }
                                                                            },

                                                                            // Label
                                                                            "& .MuiInputLabel-root": {
                                                                                color: "#aaa",
                                                                            },

                                                                            // Input text
                                                                            "& .MuiPickersSectionList-root": {
                                                                                color: "#aaa"
                                                                            }
                                                                        }
                                                                    },

                                                                    // Dates inside the calendar
                                                                    day: {
                                                                        sx: {
                                                                            color: "#fff",

                                                                            "&.Mui-selected": {
                                                                                backgroundColor: "#1D9BF0",
                                                                                color: "#fff"
                                                                            },

                                                                            "&:hover": {
                                                                                backgroundColor: "rgba(29,155,240,0.15)"
                                                                            }
                                                                        }
                                                                    },

                                                                    // Popup calendar
                                                                    desktopPaper: {
                                                                        sx: {
                                                                            backgroundColor: "#16181C",
                                                                            color: "#B2BAC2",

                                                                            // Calendar header
                                                                            "& .MuiDayCalendar-weekDayLabel": {
                                                                                color: "#aaa"
                                                                            },

                                                                            "& .MuiPickersCalendarHeader-switchViewIcon": {
                                                                                color: "#aaa"
                                                                            },

                                                                            "& .MuiPickersArrowSwitcher-button": {
                                                                                color: "#aaa"
                                                                            },
                                                                        }
                                                                    }
                                                                }}
                                                    />
                                                )}
                                    />
                                    <Controller name="eventTime"
                                                control={control}
                                                defaultValue={null}
                                                render={({ field }) =>  (
                                                    <TimePicker
                                                        label="Time"
                                                        value={field.value ?? null}
                                                        onChange={field.onChange}
                                                        timeSteps={{
                                                            minutes: 30
                                                        }}
                                                        views={["hours", "minutes"]}
                                                        viewRenderers={{
                                                            hours: renderDigitalClockTimeView,
                                                            minutes: renderDigitalClockTimeView,
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                sx: {
                                                                    // Clock icon
                                                                    "& .MuiSvgIcon-root": {
                                                                        color: "#aaa"
                                                                    },

                                                                    // Input container
                                                                    "& .MuiPickersOutlinedInput-root": {

                                                                        "&:hover fieldset": {
                                                                            borderColor: "#aaa"
                                                                        }
                                                                    },

                                                                    // Label
                                                                    "& .MuiInputLabel-root": {
                                                                        color: "#aaa"
                                                                    },

                                                                    // Input text
                                                                    "& .MuiPickersSectionList-root": {
                                                                        color: "#aaa"
                                                                    }
                                                                }
                                                            },

                                                            // Popup time picker
                                                            desktopPaper: {
                                                                sx: {
                                                                    backgroundColor: "#16181C",
                                                                    color: "#B2BAC2"
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                    />
                                </LocalizationProvider>

                                <FormControl>
                                    <FormLabel sx={{ color: "#aaa", "&.Mui-focused": { color: "#aaa"}} }>Age Requirement</FormLabel>
                                    <RadioGroup
                                        defaultValue="21+"
                                        {...register("ageRequirement")}
                                    >
                                        <FormControlLabel value="21+"
                                                          control={ <Radio /> }
                                                          label="21+" />
                                        <FormControlLabel value="18+" control={<Radio />} label="18+" />
                                    </RadioGroup>
                                </FormControl>

                                <CustomButton
                                    variant="contained"
                                    onClick={handleSubmit(editingEvent ? updateEvent : createNewEvent)}
                                    sx={{
                                        width: 150,
                                        alignSelf: "flex-end"
                                    }}
                                >
                                    {editingEvent ? "Save Changes" : "Create Event"}
                                </CustomButton>

                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            {/* End of Create Event dialog */}
        </div>
    );
}