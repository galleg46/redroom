
"use client";

import {Dispatch, SetStateAction, useState} from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";

const accountSchema = z.object({
    phoneNumber: z
        .string()
        .min(1, "Enter a valid phone number")
        .refine((val) => val.length === 10 , {
            message: "Not a complete phone number",
        })
})

type AccountFormValues = z.infer<typeof accountSchema>;

type LoginDialogProps = {
    open: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length === 0) return "";

    if (digits.length < 4) return digits;

    if (digits.length < 7) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function LoginDialog({ open, setDialogOpen }: LoginDialogProps) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            phoneNumber: "",
        }
    });

    //const [dialogOpen, setDialogOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "warning" | "info">("info");
    const [step, setStep] = useState<'phone' | 'verify'>('phone');
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState("");


    const handleDialogClose = () => {
        setDialogOpen(false);

    }

    async function handleSendCode(values: AccountFormValues) {
        const normalizedPhone = values.phoneNumber.trim();

        setPhoneNumber(normalizedPhone);
        setLoading(true);
        setErrorMessage("");
        setStep("verify");

        try {
            //await sendCodeAction(normalizedPhone);
            //setPhoneNumber(normalizedPhone);
            //codeForm.reset({ verificationCode: "" });
            //setStep("code");
        } catch {
            setErrorMessage("Unable to send a verification code. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    async function handleResendCode() {
        if (!phoneNumber || loading) return;

        setLoading(true);
        //setErrorMessage(null);

        try {
            //await sendCodeAction(phoneNumber);
            //codeForm.reset({ verificationCode: "" });
        } catch {
            setErrorMessage("Unable to resend the code. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyCode() {
        setLoading(true);
        //setErrorMessage(null);

        try {
            //await verifyCodeAction(phoneNumber, values.verificationCode);
            //successAction();
            handleDialogClose();
        } catch {
            setErrorMessage(
                "Verification failed. Check your code or request a new one.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="xs"
            aria-labelledby="login-dialog-title"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        p: 1,
                    },
                },
            }}
        >
            <DialogTitle id="login-dialog-title">
                {step === "phone" ? "Sign in to Red Room" : "Verify your phone"}
            </DialogTitle>

            <DialogContent>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    {step === "phone"
                        ? "Enter your phone number to receive a one-time verification code."
                        : `Enter the 6-digit code sent to ${phoneNumber}.`}
                </Typography>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                {step === "phone" ? (
                    <Box
                        component="form"
                        //onSubmit={phoneForm.handleSubmit(handleSendCode)}
                        noValidate
                    >
                        <TextField
                            label="Phone Number"
                            variant="standard"
                            value={formatPhone(phoneNumber || "")}
                            onChange={(e) => {

                                const digits = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 10);

                                setValue("phoneNumber", digits);
                            }}
                            required
                            slotProps={{
                                htmlInput: {
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                    maxLength: 14,
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ mt: 3 }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Send verification code"
                            )}
                        </Button>
                    </Box>
                ) : (
                    <Box
                        component="form"
                        //onSubmit={codeForm.handleSubmit(handleVerifyCode)}
                        noValidate
                    >
                        <TextField
                            //{...codeForm.register("verificationCode")}
                            label="Verification code"
                            placeholder="123456"
                            type="text"
                            autoComplete="one-time-code"
                            fullWidth
                            autoFocus
                            disabled={loading}
                            //error={Boolean(codeForm.formState.errors.verificationCode)}
                            helperText={
                                "codeForm.formState.errors.verificationCode?.message" //TODO: uncomment
                            }
                            slotProps={{
                                htmlInput: {
                                    inputMode: "numeric",
                                    maxLength: 6,
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{ mt: 3 }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Verify and sign in"
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="text"
                            fullWidth
                            onClick={handleResendCode}
                            disabled={loading}
                            sx={{ mt: 1 }}
                        >
                            Resend verification code
                        </Button>

                        <Button
                            type="button"
                            variant="text"
                            fullWidth
                            onClick={() => {
                                setStep("phone");
                                setErrorMessage("");
                                //codeForm.reset({ verificationCode: "" });
                            }}
                            disabled={loading}
                        >
                            Change phone number
                        </Button>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 2, pb: 2 }}>
                <Button onClick={handleDialogClose} color="inherit">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
