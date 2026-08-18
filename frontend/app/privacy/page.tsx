"use client";

import {useEffect, useState} from "react";
import {Paper} from "@mui/material";
import ReactMarkdown from "react-markdown";

export default function Page() {

    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        fetch("/documents/privacy.md")
            .then((res) => res.text())
            .then(setMarkdown);
    }, [])

    return (
        <div className="flex min-h-screen flex-col">

            <h1 className="text-center text-4xl pt-5">
                Privacy Policy
            </h1>

            <Paper elevation={0}
                   sx={{
                       backgroundColor: "transparent",
                       color: "white",
                       paddingX: "3.25rem",
                       paddingY: "1rem",
                   }}
                   className="rounded-lg md:p-8"
            >
                <div className="markdown-privacy-content">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
            </Paper>
        </div>
    );
}