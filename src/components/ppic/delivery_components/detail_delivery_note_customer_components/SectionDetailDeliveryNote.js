import React from "react";
import { ActionButtons } from "../../../custom_components";
import { Button, TextInput, Select, Group, Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconUser, IconCalendarEvent, IconClipboardCheck, IconPrinter, IconCodeAsterix, IconUserCheck, IconTruckDelivery, } from "@tabler/icons";


export default function SectionDetailDeliveryNote(
    { editAccess,
        handleSubmit,
        handleClickDeleteButton,
        handleClickEditButton,
        customerName,
        form,
        openModalPrintDeliveryNote,
        driverList,
        vehicleList,
    }
) {

    return (
        <>

            <Group
                position="apart"
            >
                <Button
                    radius='md'
                    leftIcon={<IconPrinter />}
                    onClick={openModalPrintDeliveryNote}
                >
                    Print
                </Button>



                <ActionButtons
                    editAccess={editAccess}
                    formState={form.isDirty()}
                    handleClickDeleteButton={handleClickDeleteButton}
                    handleClickEditButton={handleClickEditButton}
                    formId={'formEditDeliveryNote'}
                />

            </Group>

            <form
                id='formEditDeliveryNote'
                onSubmit={form.onSubmit(handleSubmit)} >

                <TextInput
                    variant="filled"
                    icon={<IconUserCheck />}
                    label='Customer'
                    m='xs'
                    radius='md'
                    readOnly
                    value={customerName}
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
                    placeholder="Pick a date"
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
                    placeholder="Input description notes"
                    label='Description notes'
                    radius='md'
                    {...form.getInputProps('note')}
                />
            </form>

        </>
    )
}
