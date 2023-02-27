import React from "react"
import { IconAsset, IconClipboardList, IconCalendar, IconClipboardCheck } from "@tabler/icons"
import { DatePicker } from "@mantine/dates"
import { TextInput, NumberInput } from "@mantine/core"
import { closeAllModals } from "@mantine/modals"
import { useForm } from "@mantine/form"
import { useRequest } from "../../../../hooks"
import { generateDataWithDate } from "../../../../services"
import { ModalForm, ReadOnlyTextInput } from "../../../custom_components"
import { SuccessNotif, FailedNotif } from "../../../notifications"
import { Group } from "@mantine/core"



const ModalEditReceiptSchedule = ({ data, setUpdateSchedule }) => {
    const { Put } = useRequest()
    const form = useForm({
        initialValues: {
            id: data.id,
            quantity: data.quantity,
            date: new Date(data.date),
            material_order: data.material_order.id,
            fulfilled_quantity: data.fulfilled_quantity
        }
    })

    const handleSubmit = async (value) => {
        const { date, ...rest } = value
        const validate_data = generateDataWithDate(date, rest)

        try {
            const updatedSchedule = await Put(validate_data.id, validate_data, 'material-receipt-schedule-management')
            setUpdateSchedule(updatedSchedule)
            SuccessNotif('Edit schedule success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else if (e.message.data.material_order) {
                FailedNotif(e.message.data.material_order)
            } else {
                FailedNotif('Update schedule failed')
            }
        }
    }

    return (
        <ModalForm
            formId='formEditReceiptSchedule'
            onSubmit={form.onSubmit(handleSubmit)} >

            <ReadOnlyTextInput
                label='Material'
                m='xs'
                icon={<IconAsset />}
                value={data.material_order.material.name}
            />

            <DatePicker
                required
                label='Schedule date'
                placeholder="Pick schedule date"
                radius='md'
                m='xs'
                icon={<IconCalendar />}
                {...form.getInputProps('date')}
            />

            <Group m='xs' grow >

                <NumberInput
                    hideControls
                    required
                    label='Quantity'
                    placeholder="Input planning quantity material receipt"
                    {...form.getInputProps('quantity')}
                    icon={<IconClipboardList />}
                    radius='md'
                />

                <TextInput
                    label='Quantity arrived'
                    radius='md'
                    readOnly
                    variant="filled"
                    icon={<IconClipboardCheck />}
                    value={form.values.fulfilled_quantity}
                />

            </Group>

        </ModalForm>
    )
}

export default ModalEditReceiptSchedule