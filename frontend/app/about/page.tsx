"use client";

import {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import {Paper} from "@mui/material";

export default function Page() {

    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        fetch("/documents/redvalues.md")
            .then((res) => res.text())
            .then(setMarkdown);
    }, [])

    return (
        <div className="flex min-h-screen flex-col">

            <h1 className="text-center text-4xl pt-5">
                About Us
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
                <div className="markdown-redValues-content">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
            </Paper>
        </div>
    );
}