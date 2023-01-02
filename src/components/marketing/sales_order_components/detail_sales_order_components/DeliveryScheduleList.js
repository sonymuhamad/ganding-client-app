import React, { useMemo, useCallback } from "react";

import { DatePicker } from "@mantine/dates";
import { useRequest } from "../../../../hooks";

import { BaseTable } from "../../../tables";
import { closeAllModals, openModal, openConfirmModal } from "@mantine/modals";

import { Button, Group, NumberInput, Select, TextInput, Text } from "@mantine/core";

import { IconBarcode, IconCalendar, IconCodeAsterix, IconDownload, IconPlus, IconTruckDelivery, IconTrash, IconEdit } from "@tabler/icons";
import { CustomSelectComponentProduct } from "../../../layout";
import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from "../../../notifications";




const ModalAddDeliverySchedule = ({ handleAddDeliverySchedule, productOrderList }) => {

    const { Post, Loading } = useRequest()

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


    const generateDate = useCallback((date, data) => {
        if (date) {
            return { ...data, date: date.toLocaleDateString('en-CA') }
        }
        return data
    }, [])

    const handleSubmit = async (value) => {

        const { date, ...rest } = value
        const validate_data = generateDate(date, rest)
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
        <form onSubmit={form.onSubmit(handleSubmit)} >

            <Loading />

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

            <Button
                radius='md'
                fullWidth
                type='submit'
                leftIcon={<IconDownload />}
            >
                Save
            </Button>

        </form>
    )
}

const ModalEditDeliverySchedule = ({ handleChangeDeliverySchedule, data }) => {

    const { product_order, date, ...rest } = data
    const { id, product } = product_order
    const { name, code } = product
    const { Put, Loading } = useRequest()

    const form = useForm({
        initialValues: {
            ...rest,
            date: new Date(date),
            product_order: id
        }
    })

    const generateDate = useCallback((date, data) => {
        if (date) {
            return { ...data, date: date.toLocaleDateString('en-CA') }
        }
        return data
    }, [])

    const handleSubmit = async (value) => {
        const { date, id, ...rest } = value
        const validate_data = generateDate(date, rest)

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
        <form onSubmit={form.onSubmit(handleSubmit)} >
            <Loading />

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

            <Button
                type='submit'
                fullWidth
                leftIcon={<IconDownload />}
                radius='md'
            >
                Save
            </Button>


        </form>
    )
}


const DeliveryScheduleList = ({ data, productOrderList, handleChangeDeliverySchedule, handleAddDeliverySchedule, handleDeleteDeliverySchedule }) => {

    const { Delete } = useRequest()

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


    const openModalDeleteSchedule = useCallback((id) => openConfirmModal({
        title: `Delete Product Order`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteSchedule(id),
    }), [handleDeleteSchedule])

    const columnDeliverySchedule = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product_order.product.name,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Product number',
            selector: row => row.product_order.product.code,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: '',
            selector: row =>
                <Button
                    leftIcon={<IconEdit stroke={2} size={16} />}
                    color='blue.6'
                    variant='subtle'
                    radius='md'
                    mx='xs'
                    onClick={() => openModalEditDeliverySchedule(row)}
                >
                    Edit
                </Button>,
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: 0
            }
        },
        {
            name: '',
            selector: row => <Button
                leftIcon={<IconTrash stroke={2} size={16} />}
                color='red.6'
                variant='subtle'
                radius='md'
                onClick={() => openModalDeleteSchedule(row.id)}
            >
                Delete
            </Button>,
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: 0
            }
        }
    ], [openModalDeleteSchedule, openModalEditDeliverySchedule])

    return (
        <>

            <Group
                m='xs'
                position="right"
            >
                <Button
                    radius='md'
                    leftIcon={<IconPlus />}
                    variant='outline'
                    onClick={openModalAddDeliverySchedule}
                >
                    Delivery schedule
                </Button>

            </Group>

            <BaseTable
                column={columnDeliverySchedule}
                data={data}
                noData='No delivery schedule'
            />

        </>
    )
}

export default DeliveryScheduleList
