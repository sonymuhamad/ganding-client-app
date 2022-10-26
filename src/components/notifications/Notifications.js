import React from "react";
import { showNotification } from "@mantine/notifications";
import { IconCircleCheck, IconX } from "@tabler/icons";


const SuccessNotif = (message) => {

    showNotification({
        title: 'Success',
        message: message,
        disallowClose: true,
        autoClose: 4000,
        icon: <IconCircleCheck />,
        radius: 'lg'
    })
}

const FailedNotif = (message) => {
    showNotification({
        title: 'Failed',
        message: message,
        disallowClose: true,
        autoClose: 4000,
        icon: <IconX />,
        color: 'red',
        radius: 'lg'
    })
}


export { SuccessNotif, FailedNotif }

