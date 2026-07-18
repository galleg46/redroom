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
        <div className="bg-black flex min-h-screen flex-col p-6">

            <h1 className="text-center text-4xl pb-3">
                About Us
            </h1>

            <Paper elevation={8}
                   sx={{ bgcolor: "black", color: "white" }}
                   className="rounded-lg p-4 md:p-8"
            >
                <div className="markdown-content">
                    <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
            </Paper>
        </div>
    );
}