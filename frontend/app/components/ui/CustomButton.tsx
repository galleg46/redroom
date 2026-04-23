import { styled } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import Button, { ButtonProps } from "@mui/material/Button";

export const CustomButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(red["A700"]),
    backgroundColor: red["A700"],
    '&:hover': {
        backgroundColor: red[900],
    }
}));