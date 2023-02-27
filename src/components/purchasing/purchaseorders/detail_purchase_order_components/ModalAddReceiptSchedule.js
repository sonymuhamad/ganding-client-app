import React from "react"
import { Select, NumberInput } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { IconAsset, IconClipboardList, IconCalendar } from "@tabler/icons"
import { useForm } from "@mantine/form"
import { closeAllModals } from "@mantine/modals"

import { generateDataWithDate } from "../../../../services"
import { ModalForm } from "../../../custom_components"
import { useRequest } from "../../../../hooks"
import { FailedNotif, SuccessNotif } from "../../../notifications"



const ModalAddReceiptSchedule = ({ materialOrderList, setAddSchedule }) => {

    const { Post } = useRequest()
    const form = useForm({
        initialValues: {
            quantity: undefined,
            date: null,
            material_order: null,
        }
    })

    const handleSubmit = async (value) => {
        const { date, ...rest } = value
        const validate_data = generateDataWithDate(date, rest)

        try {
            const newSchedule = await Post(validate_data, 'material-receipt-schedule-management')
            setAddSchedule(newSchedule)
            SuccessNotif('Add schedule success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.material_order) {
                FailedNotif(e.message.data.material_order)
            } else {
                FailedNotif('Add schedule failed')
            }
        }
    }

    return (
        <ModalForm
            formId='formAddReceiptSchedule'
            onSubmit={form.onSubmit(handleSubmit)} >

            <Select
                label='Material'
                placeholder="Select material"
                radius='md'
                required
                m='xs'
                data={materialOrderList.map(mat => ({ value: mat.id, label: mat.material.name }))}
                icon={<IconAsset />}
                {...form.getInputProps('material_order')}
            />

            <DatePicker
                required
                label='Schedule date'
                placeholder="Select schedule date"
                radius='md'
                m='xs'
                icon={<IconCalendar />}
                {...form.getInputProps('date')}
            />

            <NumberInput
                label='Quantity'
                placeholder="Input planning quantity receipt"
                radius='md'
                m='xs'
                required
                hideControls
                icon={<IconClipboardList />}
                {...form.getInputProps('quantity')}
            />

        </ModalForm>
    )
}

export default ModalAddReceiptSchedule