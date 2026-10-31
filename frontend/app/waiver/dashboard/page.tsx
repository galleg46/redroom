"use client";

import {useEffect, useState} from "react";
import { EventAttendee } from "@/app/models/EventAttendee";
import { getAllAttendees } from "@/app/service/waiverService";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {CustomTextField} from "@/app/components/ui/CustomTextField";

export default function Page(){

    const [eventAttendees, setEventAttendees] = useState<EventAttendee[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        loadAttendees();
    }, []);

    const loadAttendees = async () => {
      try {
          const data = await getAllAttendees();
          setEventAttendees(data);
      } catch (error) {
          console.log(error);
      } finally {
          setLoading(false);
      }
    };

    const filteredAttendees = eventAttendees.filter((attendee) => {
        const search = searchTerm.trim().toLowerCase();

        if(!search) return true;

        const firstName = attendee.firstName?.toLowerCase() ?? "";
        const lastName = attendee.lastName?.toLowerCase() ?? "";
        const fullName = `${firstName} ${lastName}`;

        return (
            firstName.includes(search) ||
            lastName.includes(search) ||
            fullName.includes(search)
        );
    })

    return(
        <div className="flex min-h-screen flex-col">
            <h1 className="text-center text-4xl pt-5 pb-5">
                Event Attendee Dashboard
            </h1>

            <div className="w-full max-w-xl mx-auto px-4 pb-5">
                <CustomTextField
                    fullWidth={true}
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by first or last name..."
                    variant="outlined"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "grey.500" }}/>
                                </InputAdornment>
                            )
                        }
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            fontFamily: "Arial, sans-serif",
                            fontSize: "14px",
                            lineHeight: 1.6,
                        },
                        "& .MuiInputBase-input::placeholder": {
                            fontFamily: "Arial, sans-serif",
                            fontSize: "14px",
                            opacity: 1,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#555",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#777",
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#999",
                        }
                    }}
                />
            </div>

            <TableContainer component={Paper} sx={{ backgroundColor: "black"}}>
                <Table sx={{
                    minWidth: 650,
                    backgroundColor: "black",
                    fontFamily: "Arial, sans-serif",
                    "& .MuiTableCell-root": {
                        color: "white",
                        borderColor: "#333",
                        fontFamily: "Arial, sans-serif",
                        fontSize: "14px",
                        lineHeight: 1.6,
                    },
                    "& .MuiTableHead-root .MuiTableCell-root": {
                        fontWeight: 700,
                        fontSize: "15px",
                    }
                }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">First Name</TableCell>
                            <TableCell align="center">Last Name</TableCell>
                            <TableCell align="center">Submitted At</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Phone Number</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Loading attendees...
                                </TableCell>
                            </TableRow>
                        ) : filteredAttendees.length > 0 ? (
                            filteredAttendees.map((attendee) => (
                                <TableRow key={attendee.id}>
                                    <TableCell align="center">{attendee.firstName}</TableCell>
                                    <TableCell align="center">{attendee.lastName}</TableCell>
                                    <TableCell align="center">{new Date(attendee.submittedAt).toLocaleString()}</TableCell>
                                    <TableCell align="center">{attendee.email}</TableCell>
                                    <TableCell align="center">{attendee.phoneNumber}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No attendees found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}