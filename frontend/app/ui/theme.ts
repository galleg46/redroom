
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#D50000",
            dark: "#B71C1C",
            contrastText: "#FFFFFF",
        },
        background: {
            default: "#16181C",
            paper: "#000000",
        },
    },
    typography: {
        fontFamily: "var(--font-orbitron), sans-serif",
        button: {
            fontFamily: "inherit",
            fontWeight: 600,
            textTransform: "none",
        },
    },
});

export default theme;
