import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useRequest } from "../../../hooks"
import { BaseTableExpanded, BaseTable } from "../../tables";


import { Button, NumberInput, Text, TextInput, Paper } from "@mantine/core";
import { IconPlus, IconEdit, IconTrash, IconCalendarEvent, IconPackgeExport, IconDownload, IconBarcode, IconRegex } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";
import { openModal, openConfirmModal, closeAllModals } from "@mantine/modals";
import { FailedNotif, SuccessNotif } from "../../notifications";


const ModalAddReceiptSubcontSchedule = ({ productSubcont, setAction }) => {


    const { Post } = useRequest()
    const [date, setDate] = useState('')
    const [quantity, setQuantity] = useState('')


    const handleSubmit = useCallback(async () => {
        try {
            await Post({ quantity: quantity, date: date.toLocaleDateString('en-CA'), product_subcont: productSubcont.id }, 'receipt-subcont-schedule-management')
            setAction(prev => prev + 1)
            closeAllModals()
            SuccessNotif('Add schedule success')
        } catch (e) {
            console.log(e)
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Add schedule failed')
            }
        }
    }, [quantity, date, productSubcont, Post, setAction])

    const openConfirmSubmit = useCallback((e) => {
        e.preventDefault()

        return openConfirmModal({
            title: `Add arrival schedule`,
            children: (
                <Text size="sm">
                    Are you sure?, data will be saved.
                </Text>
            ),
            radius: 'md',
            labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
            cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
            confirmProps: { radius: 'md' },
            onConfirm: () => handleSubmit()
        })
    }
        , [handleSubmit])

    return (
        <form onSubmit={openConfirmSubmit} >

            <TextInput
                variant="unstyled"
                m='xs'
                readOnly
                icon={<IconBarcode />}
                value={productSubcont.product.name}
            />

            <TextInput
                readOnly
                m='xs'
                variant="unstyled"
                icon={<IconRegex />}
                value={productSubcont.product.code}
            />

            <NumberInput
                min={0}
                radius='md'
                hideControls
                rightSection={
                    <Text size='sm' color='dimmed' >
                        Pcs
                    </Text>
                }
                icon={<IconPackgeExport />}
                value={quantity}
                onChange={value => setQuantity(value)}
                m='xs'
                label='Quantity arrival'
                placeholder="Input quantity arrival"
                required
            />

            <DatePicker
                icon={<IconCalendarEvent />}
                value={date}
                onChange={value => setDate(value)}
                radius='md'
                m='xs'
                placeholder="Pick arrival date"
                label='Arrival date'
                required
            />

            <Button
                fullWidth
                leftIcon={<IconDownload />}
                type='submit'
                radius='md'
                disabled={quantity === '' || parseInt(quantity) === 0}
            >
                Save
            </Button>

        </form>

    )
}

const ModalEditReceiptSubcontSchedule = ({ dataSchedule, setAction, productSubcont }) => {

    const [date, setDate] = useState(() => new Date())
    const [quantity, setQuantity] = useState('')

    const { Put } = useRequest()

    useEffect(() => {

        setQuantity(dataSchedule.quantity)
        setDate(new Date(dataSchedule.date))

    }, [dataSchedule])


    const handleSubmit = useCallback(async () => {
        try {
            await Put(dataSchedule.id, { quantity: quantity, date: date.toLocaleDateString('en-CA'), product_subcont: productSubcont.id }, 'receipt-subcont-schedule-management')
            SuccessNotif('Edit arrival schedule success')
            setAction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            console.log(e)
            FailedNotif('Edit arrival schedule failed')
        }
    }, [dataSchedule, quantity, date, setAction, Put, productSubcont])

    const openConfirmEditSchedule = useCallback((e) => {
        e.preventDefault()

        return openConfirmModal({
            title: `Edit arrival schedule`,
            children: (
                <Text size="sm">
                    Are you sure?, data will be saved.
                </Text>
            ),
            radius: 'md',
            labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
            cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
            confirmProps: { radius: 'md' },
            onConfirm: () => handleSubmit()
        })
    }, [handleSubmit])

    return (

        <form onSubmit={openConfirmEditSchedule} >


            <TextInput
                variant="unstyled"
                m='xs'
                readOnly
                icon={<IconBarcode />}
                value={productSubcont.product.name}
            />

            <TextInput
                readOnly
                m='xs'
                variant="unstyled"
                icon={<IconRegex />}
                value={productSubcont.product.code}
            />

            <NumberInput
                radius='md'
                icon={<IconPackgeExport />}
                value={quantity}
                onChange={value => setQuantity(value)}
                m='xs'
                label='Quantity arrival'
                placeholder="Input quantity arrival"
                required
            />

            <DatePicker
                icon={<IconCalendarEvent />}
                value={date}
                onChange={value => setDate(value)}
                radius='md'
                m='xs'
                placeholder="Pick arrival date"
                label='Arrival date'
                required
            />

            <Button
                fullWidth
                leftIcon={<IconDownload />}
                type='submit'
                radius='md'
                disabled={dataSchedule.quantity === parseInt(quantity) && new Date(dataSchedule.date).toLocaleDateString() === date.toLocaleDateString()}
            >
                Save
            </Button>

        </form>
    )
}


const ExpandedProductSubconstruction = ({ data }) => {

    const [schedules, setSchedules] = useState([])
    const [action, setAction] = useState(0)
    const { Delete } = useRequest()

    const columnScheduleReceiptSubcont = useMemo(() => [
        {
            name: 'Date',
            selector: row => row.date
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        },
        {
            name: '',
            selector: row => row.editButton
        },
        {
            name: '',
            selector: row => row.deleteButton
        }
    ], [])


    const openEditSchedule = useCallback((schedule) => openModal({
        title: 'Edit arrival schedule of product subconstruction',
        radius: 'md',
        size: 'lg',
        children: <ModalEditReceiptSubcontSchedule dataSchedule={schedule} productSubcont={data} setAction={data.setAction} />

    }), [data])

    const handleDelete = useCallback(async (id) => {
        try {
            await Delete(id, 'receipt-subcont-schedule-management')
            SuccessNotif('Delete arrival schedule of product subconstruction success')
            data.setAction(prev => prev + 1)
            setAction(prev => prev + 1)
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }, [data, Delete])

    const openDeleteSchedule = useCallback((id) => openConfirmModal({
        title: `Delete schedule`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDelete(id)
    }), [handleDelete])



    useEffect(() => {

        setSchedules(data.receiptsubcontschedule_set.map(schedule => ({
            ...schedule, editButton:
                <Button
                    leftIcon={<IconEdit stroke={2} size={16} />}
                    color='blue.6'
                    variant='subtle'
                    radius='md'
                    mx='xs'
                    onClick={() => openEditSchedule(schedule)}
                >
                    Edit
                </Button>, deleteButton:
                <Button
                    leftIcon={<IconTrash stroke={2} size={16} />}
                    color='red.6'
                    variant='subtle'
                    radius='md'
                    mx='xs'
                    onClick={() => openDeleteSchedule(schedule.id)}
                >
                    Edit
                </Button>
        })))

    }, [action, data, openDeleteSchedule, openEditSchedule])



    return (
        <Paper m='xs' p='xs' radius='md' >

            <BaseTable
                column={columnScheduleReceiptSubcont}
                data={schedules}
                pagination={false}
                noData={" this subconstruction doesn't have arrival schedule "}
            />

        </Paper>
    )
}


const ProductSubconstruction = () => {


    const { Get } = useRequest()

    const [action, setAction] = useState(0)
    const [productSubconstruction, setProductSubconstruction] = useState([])

    const columnProductSubconstruction = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name
        },
        {
            name: 'Product number',
            selector: row => row.product.code
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        },
        {
            name: '',
            selector: row => row.button,
            style: {
                margin: -10,
                padding: -15,
            }
        }
    ], [])

    const openAddSchedule = useCallback((product) => openModal({
        title: 'Add arrival schedule',
        radius: 'md',
        size: 'lg',
        children: <ModalAddReceiptSubcontSchedule productSubcont={product} setAction={setAction} />
    }), [])

    const fetchProductSubcont = useCallback(async () => {
        try {
            const productSubcont = await Get('product-delivery-subcont')

            setProductSubconstruction(productSubcont.map(product => ({
                ...product, action: action, setAction: setAction, button:
                    <Button
                        leftIcon={<IconPlus />}
                        color='blue.6'
                        variant='subtle'
                        radius='md'
                        mx='xs'
                        onClick={() => openAddSchedule(product)}
                    >
                        Schedule
                    </Button>
            })))

        } catch (e) {
            console.log(e)
        }
    }, [openAddSchedule, action])

    useEffect(() => {
        fetchProductSubcont()
    }, [fetchProductSubcont])



    return (
        <>

            <BaseTableExpanded
                column={columnProductSubconstruction}
                data={productSubconstruction}
                expandComponent={ExpandedProductSubconstruction}
            />


        </>
    )

}

export default ProductSubconstruction
