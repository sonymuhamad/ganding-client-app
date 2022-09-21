import React from "react";
import { showNotification } from "@mantine/notifications";
import { IconCircleCheck, IconX } from "@tabler/icons";


const SuccessNotif = (message) => {

    showNotification({
        title: 'Success',
        message: message,
        disallowClose: true,
        autoClose: 4000,
        icon: <IconCircleCheck />
    })
}

const FailedNotif = (message) => {
    showNotification({
        title: 'Failed',
        message: message,
        disallowClose: true,
        autoClose: 4000,
        icon: <IconX />,
        color: 'red'
    })
}


export { SuccessNotif, FailedNotif }

