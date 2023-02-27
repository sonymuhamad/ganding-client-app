import React from "react"
import { TextInput, Group, Textarea } from "@mantine/core"
import { IconUserCheck, IconUser, IconCodeAsterix, IconClipboardList, IconTruck, IconCalendar } from "@tabler/icons"

const SectionDetailDeliveryNoteSubcont = (
    { supplierName, code, date, driverName, vehicleNumber, note }
) => {

    return (
        <>
            <TextInput
                readOnly
                variant='filled'
                label='Supplier'
                m='xs'
                radius='md'
                icon={<IconUserCheck />}
                value={supplierName}
            />

            <TextInput
                label='Delivery number'
                variant='filled'
                m='xs'
                radius='md'
                readOnly
                icon={<IconCodeAsterix />}
                value={code}
            />

            <Group m='xs' grow >


                <TextInput
                    label='Delivery date'
                    readOnly
                    variant="filled"
                    radius='md'
                    icon={<IconCalendar />}
                    value={new Date(date).toDateString()}
                />

                <TextInput
                    label='Driver name'
                    readOnly
                    variant='filled'
                    radius='md'
                    icon={<IconUser />}
                    value={driverName}
                />

                <TextInput
                    label='Vehicle number'
                    readOnly
                    variant='filled'
                    radius='md'
                    icon={<IconTruck />}
                    value={vehicleNumber}
                />

            </Group>

            <Textarea
                label='Delivery descriptions'
                readOnly
                variant='filled'
                radius='md'
                m='xs'
                icon={<IconClipboardList />}
                value={note}
            />

        </>
    )
}

export default SectionDetailDeliveryNoteSubcont