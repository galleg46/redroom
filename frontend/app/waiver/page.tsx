"use client";

import { useForm } from "react-hook-form";
import {useEffect, useState} from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomButton } from "@/app/components/ui/CustomButton";
import { CustomTextField } from "@/app/components/ui/CustomTextField";
import {Alert, Checkbox, FormControl, FormControlLabel, IconButton, Paper, Snackbar} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactMarkdown from "react-markdown";

const waiverSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Not a valid email address"),
    phoneNumber: z
        .string()
        .min(1, "Phone number is required")
        .refine((val) => val.length === 10, {
            message: "Not a complete phone number",
        }),
    agreement: z.literal(true, {
        error: () => ({
            message: "You must acknowledge and agree to the agreement."
        })
    })
});

const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length === 0) return "";

    if (digits.length < 4) return digits;

    if (digits.length < 7) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function Page() {

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(waiverSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
        }
    });

    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [markdown, setMarkdown] = useState("");
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

    const [alertSeverity, setAlertSeverity] = useState<
        "success" | "error" | "warning" | "info"
    >("info");

    const phoneNumber = watch("phoneNumber");

    const showAlert = (
        message: string,
        severity: "success" | "error" | "warning" | "info") => {

            setAlertMessage(message);
            setAlertSeverity(severity);
            setOpen(true);
    };

    const onSubmit = (data: any) => {
        submitAttendeeAgreement(data);
    };

    const submitAttendeeAgreement = async (formData: any) => {

        try {

            const response = await fetch(`${API_URL}/waiver`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {

                showAlert(
                    "Thanks for completing the Attendee Agreement! Your submission has been accepted.",
                    "success"
                );

                return;
            }

            switch (response.status) {

                case 400:
                    showAlert(
                        "Malformed data, please check your form entries.",
                        "error"
                    );
                    break;

                case 409:
                    showAlert(
                        "You have already submitted your Attendee Agreement form.",
                        "success"
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

            console.error("An Error occurred while submitting waiver", error);

            showAlert(
                "Unable to connect to the server.",
                "error"
            );
        }
    };

    useEffect(() => {
        fetch("/documents/waiver.md")
            .then((res) => res.text())
            .then(setMarkdown);
    }, [])

    return (
        <div className="bg-black flex min-h-screen flex-col p-6">

            <h1 className="text-center text-4xl pb-3">
                Event Attendee Agreement & Liability Waiver
            </h1>

            <Snackbar open={open}
                      autoHideDuration={5000}
                      onClose={() => setOpen(false)}
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
                               onClick={() => setOpen(false)}
                           >
                               <CloseIcon fontSize="inherit"/>
                           </IconButton>
                       }
                >
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Paper
                elevation={8}
                sx={{ bgcolor: "black", color: "white" }}
                className=" rounded-lg p-4 md:p-8"
            >
                <div className="waiver-scroll h-125 overflow-y-auto rounded-md border border-gray-800 p-4 md:p-6">
                    <div className="markdown-content max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                    </div>
                </div>
            </Paper>

            <div className="flex items-center justify-center p-5">
                <FormControl error={!!errors.agreement}>
                    <FormControlLabel
                        required
                        control={
                            <Checkbox
                                {...register("agreement")}
                                sx={{
                                    color: "#B2BAC2",

                                    '&.Mui-checked': {
                                        color: "#d50000"
                                    }
                                }}
                            />
                        }
                        label="I have read and acknowledged the Attendee Agreement."
                    />

                    {errors.agreement && (
                        <p className="flex items-center justify-center text-red-500 text-sm mt-1">
                            {errors.agreement.message}
                        </p>
                    )}
                </FormControl>

            </div>

            <div className="flex gap-4 items-center justify-center pt-4 mb-8">

                <CustomTextField
                    label="First Name"
                    variant="standard"
                    {...register("firstName")}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    required
                />

                <CustomTextField
                    label="Last Name"
                    variant="standard"
                    {...register("lastName")}
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    required
                />

                <CustomTextField
                    label="Phone Number"
                    variant="standard"
                    value={formatPhone(phoneNumber || "")}
                    onChange={(e) => {

                        const digits = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);

                        setValue("phoneNumber", digits);
                    }}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    required
                    slotProps={{
                        htmlInput: {
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            maxLength: 14,
                        }
                    }}
                />

                <CustomTextField
                    label="Email"
                    variant="standard"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    required
                />

                <CustomButton
                    variant="contained"
                    onClick={handleSubmit(onSubmit)}
                >
                    Submit
                </CustomButton>
            </div>
        </div>
    );
}