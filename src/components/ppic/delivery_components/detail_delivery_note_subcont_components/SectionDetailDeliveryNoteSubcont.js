import React from "react"
import { ActionButtons } from "../../../custom_components"

import { TextInput, Group, Select, Textarea, Button } from "@mantine/core"
import { IconTruckDelivery, IconCalendarEvent, IconClipboardCheck, IconUser, IconUserCheck, IconCodeAsterix, IconPrinter } from "@tabler/icons"
import { DatePicker } from "@mantine/dates"


const SectionDetailDeliveryNoteSubcont = (
    { editAccess,
        form,
        handleClickEditButton,
        handleClickDeleteButton,
        handleSubmit,
        supplierName,
        driverList,
        vehicleList,
        openModalPrintDeliveryNote
    }
) => {

    return (
        <>

            <Group
                position="apart"
            >

                <Button
                    onClick={() => openModalPrintDeliveryNote()}
                    leftIcon={<IconPrinter />}
                    radius='md'
                >
                    Print
                </Button>


                <ActionButtons
                    editAccess={editAccess}
                    formId='formEditDeliveryNoteSubcont'
                    handleClickDeleteButton={handleClickDeleteButton}
                    handleClickEditButton={handleClickEditButton}
                    formState={form.isDirty()}
                />

            </Group>


            <form
                id='formEditDeliveryNoteSubcont'
                onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    variant="filled"
                    icon={<IconUserCheck />}
                    label='Supplier'
                    m='xs'
                    radius='md'
                    readOnly
                    value={supplierName}
                />

                <TextInput
                    icon={<IconCodeAsterix />}
                    m='xs'
                    placeholder="Input delivery number"
                    radius='md'
                    {...form.getInputProps('code')}
                    label='Delivery number'
                    required
                    readOnly={!editAccess}
                />

                <DatePicker
                    icon={<IconCalendarEvent />}
                    required
                    label='Delivery date'
                    placeholder="Pick delivery date"
                    disabled={!editAccess}
                    {...form.getInputProps('date')}
                    radius='md'
                    m='xs'
                />

                <Group grow m='xs' >

                    <Select
                        icon={<IconUser />}
                        placeholder="Select Driver"
                        label='Driver name'
                        radius='md'
                        readOnly={!editAccess}
                        data={driverList.map(driver => ({ value: driver.id, label: driver.name }))}
                        {...form.getInputProps('driver')}
                        required
                    />

                    <Select
                        icon={<IconTruckDelivery />}
                        placeholder="Select vehicle number"
                        label='Vehicle number'
                        radius='md'
                        readOnly={!editAccess}
                        data={vehicleList.map(vehicle => ({ value: vehicle.id, label: vehicle.license_part_number }))}
                        {...form.getInputProps('vehicle')}
                        required
                    />

                </Group>

                <Textarea
                    icon={<IconClipboardCheck />}
                    m='xs'
                    readOnly={!editAccess}
                    placeholder="Input description"
                    label='Description'
                    radius='md'
                    {...form.getInputProps('note')}
                />
            </form>

        </>
    )

}

export default SectionDetailDeliveryNoteSubcont