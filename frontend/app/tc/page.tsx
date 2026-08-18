"use client";

import {useEffect, useState} from "react";
import {Paper} from "@mui/material";
import ReactMarkdown from "react-markdown";

export default function Page() {

    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        fetch("/documents/termsConditions.md")
            .then((res) => res.text())
            .then(setMarkdown);
    }, [])

    return (
        <div className="flex min-h-screen flex-col">

            <h1 className="text-center text-4xl pt-5">
                Terms & Conditions
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
                <div className="markdown-waiver-content">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
            </Paper>
        </div>
    );
}