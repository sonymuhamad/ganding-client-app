import React, { useState } from "react";


export default function Time() {

    const [time, setTime] = useState(0)

    let now = new Date()
    let clock = now.toLocaleTimeString()
    let day = now.toDateString()

    setInterval(() => {
        return setTime((state) => state + 1)
    }, 1000)

    return (
        <>
            {day} {clock}
        </>
    )


}
