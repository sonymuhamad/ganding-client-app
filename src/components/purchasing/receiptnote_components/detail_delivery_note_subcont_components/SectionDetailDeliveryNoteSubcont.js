import React from "react"
import { Group, Textarea } from "@mantine/core"
import { IconUserCheck, IconUser, IconCodeAsterix, IconClipboardList, IconTruck, IconCalendar } from "@tabler/icons"
import { ReadOnlyTextInput } from "../../../custom_components"

const SectionDetailDeliveryNoteSubcont = (
    { supplierName, code, date, driverName, vehicleNumber, note }
) => {

    return (
        <>
            <ReadOnlyTextInput
                label='Supplier'
                m='xs'
                icon={<IconUserCheck />}
                value={supplierName}
            />

            <ReadOnlyTextInput
                label='Delivery number'
                m='xs'
                icon={<IconCodeAsterix />}
                value={code}
            />

            <Group m='xs' grow >


                <ReadOnlyTextInput
                    label='Delivery date'
                    icon={<IconCalendar />}
                    value={new Date(date).toDateString()}
                />

                <ReadOnlyTextInput
                    label='Driver name'
                    icon={<IconUser />}
                    value={driverName}
                />

                <ReadOnlyTextInput
                    label='Vehicle number'
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