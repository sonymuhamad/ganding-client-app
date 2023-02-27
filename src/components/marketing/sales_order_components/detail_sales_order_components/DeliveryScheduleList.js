import React, { useMemo, useCallback } from "react";

import { closeAllModals, openModal } from "@mantine/modals";
import { DatePicker } from "@mantine/dates";
import { Group, NumberInput, Select, TextInput } from "@mantine/core";
import { IconBarcode, IconCalendar, IconCodeAsterix, IconTruckDelivery } from "@tabler/icons";
import { useForm } from "@mantine/form";


import { BaseTable } from "../../../tables";
import { useRequest, useConfirmDelete } from "../../../../hooks";

import { CustomSelectComponentProduct } from "../../../layout";
import { FailedNotif, SuccessNotif } from "../../../notifications"

import { HeadSection, ButtonAdd, ButtonDelete, ButtonEdit, ModalForm } from "../../../custom_components";
import { generateDataWithDate } from "../../../../services";


const ModalAddDeliverySchedule = ({ handleAddDeliverySchedule, productOrderList }) => {

    const { Post } = useRequest()

    const form = useForm({
        initialValues: {
            quantity: '',
            date: null,
            product_order: ''
        }
    })

    const getSelectedProductOrder = useCallback((id) => {
        return productOrderList.find(productOrder => productOrder.id === parseInt(id))
    }, [productOrderList])


    const handleSubmit = async (value) => {

        const { date, ...rest } = value
        const validate_data = generateDataWithDate(date, rest)
        const { product_order } = validate_data
        const selectedProductOrder = getSelectedProductOrder(product_order)

        try {
            const newSchedule = await Post(validate_data, 'delivery-schedule-management')
            handleAddDeliverySchedule({ ...newSchedule, product_order: selectedProductOrder })
            SuccessNotif('Add schedule success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add schedule failed')
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
                return
            }
        }
    }

    return (
        <ModalForm
            id='formAddDeliverySchedule'
            onSubmit={form.onSubmit(handleSubmit)} >

            <Select
                label='Product'
                placeholder="Select a product"
                radius='md'
                m='xs'
                searchable
                required
                icon={<IconBarcode />}
                data={productOrderList.map(productOrder => ({ value: productOrder.id, label: productOrder.product.name, code: productOrder.product.code }))}
                {...form.getInputProps('product_order')}
                itemComponent={CustomSelectComponentProduct}
            />

            <NumberInput
                hideControls
                required
                label='Quantity'
                placeholder="Input quantity"
                {...form.getInputProps('quantity')}
                icon={<IconTruckDelivery />}
                radius='md'
                m='xs'
            />

            <DatePicker
                label='Delivery date'
                placeholder="Pick a date"
                {...form.getInputProps('date')}
                required
                m='xs'
                radius='md'
                icon={<IconCalendar />}
            />

        </ModalForm>
    )
}

const ModalEditDeliverySchedule = ({ handleChangeDeliverySchedule, data }) => {

    const { product_order, date, ...rest } = data
    const { id, product } = product_order
    const { name, code } = product
    const { Put } = useRequest()

    const form = useForm({
        initialValues: {
            ...rest,
            date: new Date(date),
            product_order: id
        }
    })

    const handleSubmit = async (value) => {
        const { date, id, ...rest } = value
        const validate_data = generateDataWithDate(date, rest)

        try {
            const updatedSchedule = await Put(id, validate_data, 'delivery-schedule-management')
            handleChangeDeliverySchedule({ ...updatedSchedule, product_order: product_order })
            SuccessNotif('Update schedule success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
                return
            }
            FailedNotif('Update schedule failed')
        }
    }

    return (
        <ModalForm
            id='formEditDeliverySchedule'
            onSubmit={form.onSubmit(handleSubmit)} >

            <TextInput
                value={name}
                readOnly
                variant='filled'
                radius='md'
                m='xs'
                label='Product name'
                icon={<IconBarcode />}
            />

            <TextInput
                value={code}
                variant='filled'
                readOnly
                radius='md'
                m='xs'
                label='Product number'
                icon={<IconCodeAsterix />}
            />

            <Group
                grow
                m='xs'
            >
                <NumberInput
                    label='Quantity'
                    radius='md'
                    icon={<IconTruckDelivery />}
                    hideControls
                    min={0}
                    placeholder="Input quantity schedule delivery"
                    {...form.getInputProps('quantity')}
                />

                <DatePicker
                    label='Date'
                    radius='md'
                    placeholder="Pick schedule delivery date "
                    icon={<IconCalendar />}
                    {...form.getInputProps('date')}
                />

            </Group>

        </ModalForm>
    )
}


const DeliveryScheduleList = ({ data, productOrderList, handleChangeDeliverySchedule, handleAddDeliverySchedule, handleDeleteDeliverySchedule }) => {

    const { Delete } = useRequest()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Delivery schedule' })

    const openModalEditDeliverySchedule = useCallback((data) => openModal({
        title: 'Edit schedule',
        radius: 'md',
        size: 'xl',
        children: <ModalEditDeliverySchedule data={data} handleChangeDeliverySchedule={handleChangeDeliverySchedule} />
    }), [handleChangeDeliverySchedule])

    const openModalAddDeliverySchedule = useCallback(() => openModal({
        title: 'Add schedule',
        radius: 'md',
        size: 'xl',
        children: <ModalAddDeliverySchedule productOrderList={productOrderList} handleAddDeliverySchedule={handleAddDeliverySchedule} />
    }), [handleAddDeliverySchedule, productOrderList])


    const handleDeleteSchedule = useCallback(async (id) => {

        try {
            await Delete(id, 'delivery-schedule-management')
            SuccessNotif('Delete delivery schedule success')
            handleDeleteDeliverySchedule(id)
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Delete delivery schedule failed')
        }
    }, [handleDeleteDeliverySchedule])


    const openModalDeleteSchedule = useCallback((id) => openConfirmDeleteData(() => handleDeleteSchedule(id)),
        [handleDeleteSchedule, openConfirmDeleteData])

    const columnDeliverySchedule = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product_order.product.name,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Rencana',
            selector: row => `${row.quantity} pcs`,
        },
        {
            name: 'Dikirim',
            selector: row => `${row.fulfilled_quantity} pcs`,
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openModalEditDeliverySchedule(row)}
            />,
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openModalDeleteSchedule(row.id)}
            />,
        }
    ], [openModalDeleteSchedule, openModalEditDeliverySchedule])

    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openModalAddDeliverySchedule}
                >
                    Delivery schedule
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnDeliverySchedule}
                data={data}
                noData='No delivery schedule'
            />

        </>
    )
}

export default DeliveryScheduleList
