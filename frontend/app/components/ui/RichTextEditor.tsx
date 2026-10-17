"use client";

import { useCallback } from "react";
import { Box, IconButton, Paper, Stack, Tooltip } from "@mui/material";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import TitleIcon from "@mui/icons-material/Title";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

type RichTextEditorProps = {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
};

export default function RichTextEditor({
                                           value,
                                           onChange,
                                           placeholder = "Write your event description...",
                                       }: RichTextEditorProps) {
    const handleUpdate = useCallback(
        ({ editor }: { editor: NonNullable<ReturnType<typeof useEditor>> }) => {
            onChange(editor.getHTML());
        },
        [onChange]
    );

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: handleUpdate,
        editorProps: {
            attributes: {
                "aria-label": "Event description editor",
                "data-placeholder": placeholder,
            },
        },
    });

    const toolbarState = useEditorState({
        editor,
        selector: ({ editor: currentEditor }) => ({
            bold: currentEditor?.isActive("bold"),
            italic: currentEditor?.isActive("italic"),
            strike: currentEditor?.isActive("strike"),
            heading2: currentEditor?.isActive("heading", { level: 2 }),
            heading3: currentEditor?.isActive("heading", { level: 3 }),
            bulletList: currentEditor?.isActive("bulletList"),
            orderedList: currentEditor?.isActive("orderedList"),
            blockquote: currentEditor?.isActive("blockquote"),
            link: currentEditor?.isActive("link"),
            canUndo: currentEditor?.can().undo(),
            canRedo: currentEditor?.can().redo(),
        }),
    });

    if (!editor) {
        return null;
    }

    // Consistent MUI styling for every toolbar button.
    const toolbarButton = (
        label: string,
        active: boolean,
        onClick: () => void,
        icon: React.ReactNode,
        disabled = false
    ) => (
        <Tooltip key={label} title={label}>
            <span>
                <IconButton
                    size="small"
                    aria-label={label}
                    aria-pressed={active}
                    disabled={disabled}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={onClick}
                    sx={{
                        p: 0.25,
                        color: active ? "#ffffff" : "text.secondary",
                        backgroundColor: active
                            ? "rgba(185, 28, 28, 0.85)"
                            : "transparent",
                        borderRadius: 1,
                        "&:hover": {
                            backgroundColor: active
                                ? "#991b1b"
                                : "action.hover",
                        },
                    }}
                >
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    );

    const setLink = () => {
        if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
        }

        const url = window.prompt("Enter the URL:");

        if (url) {
            const normalizedUrl = /^(https?:\/\/|mailto:)/i.test(url)
                ? url
                : `https://${url}`;

            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: normalizedUrl })
                .run();
        }
    };

    return (
        <Paper
            variant="outlined"
            sx={{
                width: "100%",
                boxSizing: "border-box",
                overflow: "visible",
                color: "white",
                backgroundColor: "#111111",
                borderColor: "grey.800",
                "&:focus-within": {
                    borderColor: "primary.main",
                },
            }}
        >
            {/* Formatting toolbar */}
            <Stack
                direction="row"
                sx={{
                    alignItems: "center",
                    p: 1,
                    border: 1,
                    borderColor: "grey.800",
                    backgroundColor: "#aaa",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    width: "100%"
                }}
            >
                {toolbarButton(
                    "Bold",
                    toolbarState?.bold ?? false,
                    () => editor.chain().focus().toggleBold().run(),
                    <FormatBoldIcon />
                )}

                {toolbarButton(
                    "Italic",
                    toolbarState?.italic ?? false,
                    () => editor.chain().focus().toggleItalic().run(),
                    <FormatItalicIcon />
                )}

                {toolbarButton(
                    "Strikethrough",
                    toolbarState?.strike ?? false,
                    () => editor.chain().focus().toggleStrike().run(),
                    <FormatStrikethroughIcon />
                )}

                <Box
                    sx={{
                        width: "1px",
                        height: 24,
                        bgcolor: "grey.800",
                        mx: 0.5,
                    }}
                />

                {toolbarButton(
                    "Heading 2",
                    toolbarState?.heading2 ?? false,
                    () =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run(),
                    <TitleIcon />
                )}

                {toolbarButton(
                    "Heading 3",
                    toolbarState?.heading3 ?? false,
                    () =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run(),
                    <TypographyIcon />
                )}

                {toolbarButton(
                    "Bullet list",
                    toolbarState?.bulletList ?? false,
                    () => editor.chain().focus().toggleBulletList().run(),
                    <FormatListBulletedIcon />
                )}

                {toolbarButton(
                    "Blockquote",
                    toolbarState?.blockquote ?? false,
                    () => editor.chain().focus().toggleBlockquote().run(),
                    <FormatQuoteIcon />
                )}

                {toolbarButton(
                    "Add or remove link",
                    toolbarState?.link ?? false,
                    setLink,
                    <LinkIcon />
                )}

                {toolbarButton(
                    "Remove link",
                    false,
                    () => editor.chain().focus().unsetLink().run(),
                    <LinkOffIcon />,
                    !(toolbarState?.link ?? false)
                )}

                <Box
                    sx={{
                        width: "1px",
                        height: 24,
                        backgroundColor: "grey.800",
                        mx: 0.5,
                    }}
                />

                {toolbarButton(
                    "Undo",
                    false,
                    () => editor.chain().focus().undo().run(),
                    <UndoIcon />,
                    !(toolbarState?.canUndo ?? false)
                )}

                {toolbarButton(
                    "Redo",
                    false,
                    () => editor.chain().focus().redo().run(),
                    <RedoIcon />,
                    !(toolbarState?.canRedo ?? false)
                )}
            </Stack>

            {/* Editable content area */}
            <Box
                sx={{
                    p: 2,
                    minHeight: 180,
                    "& .tiptap": {
                        minHeight: 150,
                        outline: "none",
                        lineHeight: 1.7,
                        overflowWrap: "anywhere",
                    },
                    "& .tiptap p": {
                        my: 1
                    },
                    "& .tiptap h2": {
                        fontSize: "1.5rem",
                        fontWeight: 700,
                        mt: 2,
                        mb: 1,
                    },
                    "& .tiptap h3": {
                        fontSize: "1.2rem",
                        fontWeight: 600,
                        mt: 2,
                        mb: 1,
                    },
                    "& .tiptap ul, & .tiptap ol": {
                        pl: 3,
                    },
                    "& .tiptap blockquote": {
                        borderLeft: "3px solid #b91c1c",
                        pl: 2,
                        ml: 0,
                        color: "grey.400",
                    },
                    "& .tiptap a": {
                        color: "#f87171",
                        textDecoration: "underline",
                    },
                    "& .tiptap p.is-editor-empty:first-of-type::before": {
                        content: "attr(data-placeholder)",
                        color: "grey.600",
                        float: "left",
                        height: 0,
                        pointerEvents: "none",
                    },
                }}
            >
                <EditorContent editor={editor} />
            </Box>
        </Paper>
    );
}

// A simple heading icon.
function TypographyIcon() {
    return <TitleIcon fontSize="small" />;
}
