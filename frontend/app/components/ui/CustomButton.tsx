"use client";

import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

type CustomButtonProps = ButtonProps<"a">;

export const CustomButton = styled(Button)<CustomButtonProps>(
    ({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    }
}));