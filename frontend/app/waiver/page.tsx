"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomButton } from "@/app/components/ui/CustomButton";
import { CustomTextField } from "@/app/components/ui/CustomTextField";
import {Alert, Checkbox, FormControl, FormControlLabel, IconButton, Snackbar} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const schema = z.object({
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
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
        }
    });

    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

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

            const response = await fetch("http://localhost:5294/waiver", {
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

    return (
        <div className="bg-black flex min-h-screen flex-col p-6">

            <h1 className="text-center text-4xl pb-3">
                Attendee Agreement
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

            <div className="ml-16 mr-16">
                <p className="text-center">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sodales tempor est, sed mollis orci congue a. Suspendisse molestie quam sit amet aliquam porta. Ut quis tincidunt felis, at tristique risus. Quisque hendrerit et libero vitae tincidunt. Etiam aliquam dolor ipsum, eget imperdiet metus fringilla in. Vestibulum hendrerit, orci varius dictum interdum, augue elit elementum sapien, bibendum aliquam ex est sed felis. Cras vel sodales arcu. Ut scelerisque elit in lorem accumsan auctor. Suspendisse potenti. Vivamus vel eros non ipsum malesuada dictum vel vitae arcu. Pellentesque eu enim elit. Vestibulum dictum neque non dolor porta, ornare rutrum mauris varius. Morbi fermentum nibh sed dolor pellentesque tristique. Duis dapibus velit ac velit aliquam pretium. Morbi vel risus maximus libero congue vestibulum. Nam sit amet orci ac ipsum auctor tristique.

                    Duis dui nulla, sodales vitae magna eget, ullamcorper molestie lorem. Curabitur facilisis massa bibendum neque varius consectetur. Sed eget enim egestas, tempus libero non, fermentum est. Donec vel mauris erat. Nullam fermentum pharetra scelerisque. Integer tortor enim, aliquet quis lectus id, feugiat bibendum risus. Sed gravida felis dui, sit amet pellentesque turpis aliquet sed. Duis porta velit erat, at ultrices velit eleifend et. Duis faucibus diam et neque lacinia consequat. Suspendisse potenti.

                    Maecenas nibh tellus, tempus non enim eget, vestibulum imperdiet justo. Nunc velit ipsum, varius non interdum at, molestie at dolor. Maecenas facilisis augue maximus nulla blandit ultricies. Curabitur erat turpis, sagittis non nisl id, posuere porta metus. Aliquam erat volutpat. Ut vel magna nulla. Donec convallis lorem ut tellus aliquet, eu porttitor mi sagittis. Curabitur pharetra tortor in leo sodales vulputate a interdum libero. Ut varius augue lectus, sit amet consectetur metus tristique eu. Nulla et pellentesque nunc, eu porttitor urna. Aenean dignissim, eros nec volutpat iaculis, urna quam hendrerit turpis, at efficitur mi ante a quam. Nam pretium ante vitae metus gravida, a commodo magna fermentum. Curabitur ac tincidunt dui. Nulla felis velit, tristique sit amet eros vel, sodales rhoncus nibh. Praesent dignissim luctus mollis. Aenean ac gravida nibh, id malesuada felis.

                    Phasellus sit amet ultricies quam, a euismod est. Etiam malesuada, justo sed consectetur faucibus, felis nisi faucibus neque, vel bibendum augue ante id nibh. Suspendisse luctus libero sed bibendum rhoncus. Quisque ut condimentum velit. Proin dapibus nisi at tempor elementum. Vivamus rhoncus aliquet sapien, laoreet laoreet orci tincidunt pharetra. Vestibulum vulputate posuere nulla, in euismod urna. Praesent congue ipsum ut ipsum facilisis, vel mollis mauris feugiat. Aenean dolor sapien, interdum vitae diam molestie, tempus vehicula dolor. Aenean a vestibulum erat. Phasellus rhoncus nunc mi, eu scelerisque ante congue nec.

                    Integer varius diam nec maximus sollicitudin. Proin neque tellus, imperdiet quis auctor id, elementum nec diam. Nulla elementum lacus a quam rhoncus, venenatis rutrum libero hendrerit. Donec ac risus odio. Duis rutrum neque nec velit sodales pretium. Vestibulum fringilla sodales finibus. Nunc commodo pretium egestas. Sed quis maximus dui, vel cursus dolor. Quisque porta volutpat urna, eu bibendum magna imperdiet lacinia. Suspendisse in mollis lacus, id sagittis elit. Fusce sit amet tortor eleifend, ullamcorper sapien et, fringilla turpis. Sed orci orci, euismod sit amet malesuada vel, tempor in massa.
                </p>
            </div>

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