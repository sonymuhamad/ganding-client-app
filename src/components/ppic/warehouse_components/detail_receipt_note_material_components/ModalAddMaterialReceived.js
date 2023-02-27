import React, { useState, useCallback, useEffect } from "react"
import { TextInput, Group, Select, NumberInput, Divider } from "@mantine/core";
import { useForm } from "@mantine/form"
import { IconAsset, IconCalendarEvent, IconCodeAsterix, IconArchive, IconShoppingCart, IconSortAscending2 } from "@tabler/icons";
import { closeAllModals } from "@mantine/modals"

import { useRequest } from "../../../../hooks"
import { CustomSelectComponent } from "../../../layout"
import { FailedNotif, SuccessNotif } from "../../../notifications"
import { ModalForm } from "../../../custom_components"



const ModalAddMaterialReceived = ({ setAddMaterialReceived, idDn, idSupplier }) => {

    const { Get, Post } = useRequest()
    const [materialOrderList, setMaterialOrderList] = useState([])
    const [scheduleMaterialReceipt, setScheduleMaterialReceipt] = useState([])
    const [selectSchedule, setSelectSchedule] = useState(null)

    const form = useForm({
        initialValues: {
            delivery_note_material: idDn,
            material_order: null,
            quantity: undefined,
            schedules: null,
        },
        validate: (values) => ({
            material_order: values.material_order === null ? 'This field is required' : null,
            quantity: values.quantity === undefined ? 'This field is required' : null
        })
    })

    const getSelectedSchedule = useCallback((idSelectedSchedule) => {
        const selectedSchedule = scheduleMaterialReceipt.find(({ id }) => id === parseInt(idSelectedSchedule))

        if (selectedSchedule) {
            return selectedSchedule
        }
        return null
    }, [scheduleMaterialReceipt])

    const getSelectedMaterialOrder = useCallback((idMaterialOrder) => {
        return materialOrderList.find(({ id }) => id === idMaterialOrder)

    }, [materialOrderList])

    const generateDataAfterInsert = useCallback((newMaterialReceived) => {
        const { schedules, material_order, ...rest } = newMaterialReceived
        const selectedSchedule = getSelectedSchedule(schedules)
        const selectedMaterialOrder = getSelectedMaterialOrder(material_order)

        return setAddMaterialReceived({ ...rest, schedules: selectedSchedule, material_order: selectedMaterialOrder })

    }, [getSelectedMaterialOrder, getSelectedSchedule, setAddMaterialReceived])

    const handleSubmit = useCallback(async (value) => {
        try {
            const newMaterialReceived = await Post(value, 'material-receipt-management')
            generateDataAfterInsert(newMaterialReceived)
            SuccessNotif('Add material received success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            console.log(e)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
                return
            }
            FailedNotif('Add material received failed')
        }

    }, [generateDataAfterInsert])

    useEffect(() => {
        Get('material-order-list').then(data => {
            const material_order_list = data.filter(mo => mo.material.supplier.id === parseInt(idSupplier) && mo.purchase_order_material.supplier.id === parseInt(idSupplier))
            setMaterialOrderList(material_order_list)
        })

        Get('material-receipt-schedule').then(data => {
            const scheduleMr = data.filter(schedule => schedule.material_order.material.supplier.id === parseInt(idSupplier) && schedule.material_order.purchase_order_material.supplier.id === parseInt(idSupplier))
            setScheduleMaterialReceipt(scheduleMr)
        })

    }, [idSupplier])

    const handleChangeSelectSchedule = (value) => {
        const selectedSchedule = getSelectedSchedule(value)
        setSelectSchedule(value)
        if (value === null) {
            form.setValues({
                delivery_note_material: idDn,
                material_order: null,
                quantity: undefined,
                schedules: null,
            })
        } else {
            form.setValues({
                delivery_note_material: idDn,
                material_order: selectedSchedule.material_order.id,
                quantity: selectedSchedule.quantity,
                schedules: selectedSchedule.id,
            })
        }
    }

    return (
        <ModalForm
            formId='formAddMaterialReceived'
            onSubmit={form.onSubmit(handleSubmit)}  >


            <Select
                mt='md'
                icon={<IconCalendarEvent />}
                label='Schedule'
                radius='md'
                itemComponent={CustomSelectComponent}
                placeholder="select the arrival of material from schedule"
                value={selectSchedule}
                data={scheduleMaterialReceipt.map(({ id, material_order, quantity, date }) => ({ value: id, label: material_order.material.name, date: date, quantity: quantity, unit: material_order.material.uom.name }))}
                clearable
                searchable
                nothingFound='Not found'
                onChange={handleChangeSelectSchedule}

            />

            <Divider my='lg' variant='dashed' ></Divider>

            <Select
                label='Material'
                radius='md'
                icon={<IconAsset />}
                required
                searchable
                placeholder="Select material"
                data={materialOrderList.map(mo => ({ value: mo.id, label: mo.material.name }))}
                {...form.getInputProps('material_order')}
                mb='sm'
            />

            <TextInput
                icon={<IconCodeAsterix />}
                label='Purchase order number'
                radius='md'
                variant='filled'
                value={form.values.material_order !== null ? materialOrderList.find(mo => mo.id === parseInt(form.values.material_order)).purchase_order_material.code : ''}
                readOnly
                my='sm'
            />

            <Group grow >
                <TextInput
                    icon={<IconShoppingCart />}
                    hideControls
                    radius='md'
                    readOnly
                    variant="filled"
                    label='Total quantity order'
                    value={form.values.material_order !== null ? materialOrderList.find(mo => mo.id === parseInt(form.values.material_order)).ordered : ''}

                />
                <TextInput
                    icon={<IconArchive />}
                    hideControls
                    radius='md'
                    readOnly
                    variant="filled"
                    label='Total quantity arrived'
                    value={form.values.material_order !== null ? materialOrderList.find(mo => mo.id === parseInt(form.values.material_order)).arrived : ''}
                />
            </Group>

            <NumberInput
                icon={<IconSortAscending2 />}
                hideControls
                required
                label='Quantity'
                {...form.getInputProps('quantity')}
                radius='md'
                my='sm'
                placeholder="Input arrival quantity"
            />

        </ModalForm>
    )
}

export default ModalAddMaterialReceived