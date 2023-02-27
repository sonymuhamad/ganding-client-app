import React, { useMemo } from "react";

import { TextInput, Textarea, Group } from "@mantine/core";
import { IconUserCircle, IconClock2, IconCar, IconUser, IconNotes, IconCodeAsterix } from "@tabler/icons"


const ComponentDetailDeliveryNote = ({ data }) => {

    const { code, date, note, created } = data

    const [customerName, vehicleNumber, driverName] = useMemo(() => {
        const { customer, vehicle, driver } = data
        const { name } = customer
        const { license_part_number } = vehicle

        return [name, license_part_number, driver.name]

    }, [data])

    return (
        <>


            <TextInput
                variant="filled"
                m='xs'
                radius='md'
                readOnly
                label='Customer name'
                icon={<IconUserCircle />}
                value={customerName}
            />
            <TextInput
                variant="filled"
                m='xs'
                radius='md'
                readOnly
                label='Delivery code'
                icon={<IconCodeAsterix />}
                value={code}
            />

            <TextInput
                variant="filled"
                m='xs'
                radius='md'
                readOnly
                label='Delivery date'
                icon={<IconClock2 />}
                value={new Date(date).toDateString()}
            />

            <Group grow m='xs' >

                <TextInput
                    variant="filled"
                    radius='md'
                    readOnly
                    label='Driver name'
                    icon={<IconUser />}
                    value={driverName}
                />
                <TextInput
                    variant="filled"
                    radius='md'
                    readOnly
                    label='Vehicle number'
                    icon={<IconCar />}
                    value={vehicleNumber}
                />

            </Group>


            <TextInput
                variant="filled"
                m='xs'
                radius='md'
                readOnly
                label='Created at'
                icon={<IconClock2 />}
                value={new Date(created).toDateString()}
            />

            <Textarea
                variant="filled"
                readOnly
                m='xs'
                radius='md'
                label='Note'
                icon={<IconNotes />}
                value={note}
            />


        </>
    )
}

export default ComponentDetailDeliveryNote