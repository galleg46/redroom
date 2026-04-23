import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

export const CustomTextField = styled(TextField)({
    // label default color
    "& .MuiInputLabel-root": {
        color: "#B2BAC2",
    },
    // label when focused
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#d50000",
    },
    // input text color
    "& .MuiInputBase-input": {
        color: "white",
    },
    // underline (default)
    "& .MuiInput-underline:before": {
        borderBottomColor: "white",
    },
    // underline (focused)
    "& .MuiInput-underline:after": {
        borderBottomColor: "#B2BAC2",
    },
});