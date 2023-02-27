import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useConfirmDelete, useRequest } from "../../../hooks"
import { BaseTableExpanded, BaseTable } from "../../tables";


import { NumberInput, Text, TextInput, Paper } from "@mantine/core";
import { IconCalendarEvent, IconPackgeExport, IconBarcode, IconRegex } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";
import { openModal, closeAllModals } from "@mantine/modals";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { ModalForm, ButtonAdd, ButtonDelete, ButtonEdit, HeadSection, ReadOnlyTextInput } from "../../custom_components";
import { generateDataWithDate } from "../../../services";


const ModalAddReceiptSubcontSchedule = ({ productSubcont, changeAction }) => {

    const { product, id } = productSubcont
    const { name, code } = product
    const { Post } = useRequest()
    const [date, setDate] = useState('')
    const [quantity, setQuantity] = useState('')

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()

        const validate_data = generateDataWithDate(date, { quantity: quantity, product_subcont: id })

        try {
            await Post(validate_data, 'receipt-subcont-schedule-management')
            changeAction()
            closeAllModals()
            SuccessNotif('Add schedule success')
        } catch (e) {
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
                return
            }
            FailedNotif('Add schedule failed')

        }
    }, [quantity, date, id,])

    return (
        <ModalForm
            formId='formAddSubcontReceiptSchedule'
            onSubmit={handleSubmit} >

            <ReadOnlyTextInput
                m='xs'
                icon={<IconBarcode />}
                value={name}
            />

            <ReadOnlyTextInput
                m='xs'
                icon={<IconRegex />}
                value={code}
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

        </ModalForm>

    )
}

const ModalEditReceiptSubcontSchedule = ({
    dataSchedule,
    changeAction,
    productSubcont
}) => {
    const { product, id } = productSubcont
    const { name, code } = product
    const [date, setDate] = useState(() => new Date())
    const [quantity, setQuantity] = useState('')

    const { Put } = useRequest()

    useEffect(() => {
        setQuantity(dataSchedule.quantity)
        setDate(new Date(dataSchedule.date))

    }, [dataSchedule])


    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()

        const validate_data = generateDataWithDate(date, { quantity: quantity, product_subcont: id })
        try {
            await Put(dataSchedule.id, validate_data, 'receipt-subcont-schedule-management')
            SuccessNotif('Edit arrival schedule success')
            changeAction()
            closeAllModals()
        } catch (e) {
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
                return
            }
            FailedNotif('Edit arrival schedule failed')
        }
    }, [dataSchedule, quantity, date, id])

    return (

        <ModalForm
            formId='formEditSubcontReceiptSchedule'
            onSubmit={handleSubmit} >

            <ReadOnlyTextInput
                m='xs'
                icon={<IconBarcode />}
                value={name}
            />

            <ReadOnlyTextInput
                m='xs'
                icon={<IconRegex />}
                value={code}
            />

            <NumberInput
                radius='md'
                icon={<IconPackgeExport />}
                value={quantity}
                onChange={value => setQuantity(value)}
                m='xs'
                hideControls
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

        </ModalForm>
    )
}


const ExpandedProductSubconstruction = ({ data }) => {

    const { Delete } = useRequest()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Jadwal kedatangan product subcont' })

    const openEditSchedule = useCallback((schedule) => openModal({
        title: 'Edit jadwal kedatangan product subcont',
        radius: 'md',
        size: 'lg',
        children: <ModalEditReceiptSubcontSchedule
            dataSchedule={schedule}
            productSubcont={data}
            changeAction={data.setAction}
        />
    }), [data, data.setAction])

    const openAddSchedule = useCallback(() => openModal({
        title: 'Tambah jadwal kedatangan product subcont',
        radius: 'md',
        size: 'lg',
        children: <ModalAddReceiptSubcontSchedule
            changeAction={data.setAction}
            productSubcont={data}
        />
    }), [data, data.setAction])

    const handleDelete = useCallback(async (id) => {
        try {
            await Delete(id, 'receipt-subcont-schedule-management')
            data.setAction()
            SuccessNotif('Delete jadwal kedatangan product subcont berhasil')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Delete jadwal kedatangan product subcont gagal')
        }
    }, [data.setAction])

    const columnScheduleReceiptSubcont = useMemo(() => [
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Rencana',
            selector: row => `${row.quantity} pcs`
        },
        {
            name: 'Diterima',
            selector: row => `${row.fulfilled_quantity} pcs`
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openEditSchedule(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDelete(row.id))}
            />
        }
    ], [openEditSchedule, openConfirmDeleteData, handleDelete])

    return (
        <Paper m='sm' radius='md' >

            <HeadSection>
                <ButtonAdd
                    onClick={openAddSchedule}
                >
                    Schedule
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                title={`Jadwal rencana kedatangan product subcont`}
                column={columnScheduleReceiptSubcont}
                data={data.receiptsubcontschedule_set}
                pagination={false}
                noData={"Product subcont ini tidak memiliki jadwal kedatangan"}
            />
        </Paper>
    )
}


const ProductSubconstruction = () => {

    const { Get } = useRequest()
    const [productSubconstruction, setProductSubconstruction] = useState([])
    const [action, setAction] = useState(0)

    const changeAction = useCallback(() => {
        setAction(prev => prev + 1)
    }, [])

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
            name: 'Delivery number',
            selector: row => row.deliver_note_subcont.code
        },
        {
            name: 'Delivery date',
            selector: row => row.deliver_note_subcont.date
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        },
    ], [])

    const fetchProductSubcont = useCallback(async () => {
        try {
            const productSubcont = await Get('product-delivery-subcont')
            setProductSubconstruction(productSubcont.map(prodSubcont => ({ ...prodSubcont, setAction: changeAction })))
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetchProductSubcont()
    }, [fetchProductSubcont, action])



    return (
        <>

            <BaseTableExpanded
                expandComponent={ExpandedProductSubconstruction}
                column={columnProductSubconstruction}
                data={productSubconstruction}
                noData='Tidak ada data product subcont'
            />


        </>
    )

}

export default ProductSubconstruction
