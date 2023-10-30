// Simple clock component
// Matt Rossouw (omeh-a)
// 05/2022

import { Typography } from "@mui/material";
import React, { useEffect } from "react";

const Clock : React.FC = () => {
    const [date, setDate] = React.useState(new Date());
    useEffect (() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    })
    return (
        <Typography variant="h6">
            {date.toLocaleTimeString()}
        </Typography>
    )
}

export default Clock;