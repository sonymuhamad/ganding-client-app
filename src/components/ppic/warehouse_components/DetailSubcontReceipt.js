import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "@mantine/form"

import { useRequest, useConfirmDelete, useNotification } from "../../../hooks"
import { BaseContent } from "../../layout"
import { generateDataWithDate, generateDataWithImage } from "../../../services"
import {
    SectionDetailReceiptNoteSubcont,
    SectionProductSubcontReceived
} from "./detail_receipt_note_subcont_components"



const DetailSubcontReceipt = () => {

    const { receiptNoteSubcontId } = useParams()
    const { successNotif, failedNotif } = useNotification()
    const { Put, Delete, Retrieve } = useRequest()
    const navigate = useNavigate()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Receipt note subcont' })
    const [editAccess, setEditAccess] = useState(false)
    const [productReceived, setProductReceived] = useState([])
    const [supplier, setSupplier] = useState({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
    })
    const [receiptNote, setReceiptNote] = useState({
        id: '',
        code: '',
        created: '',
        date: null,
        note: '',
        last_update: '',
        image: null,
        supplier: null
    })

    const form = useForm({
        initialValues: receiptNote
    })

    const handleClickEditButton = useCallback(() => {
        form.setValues(receiptNote)
        form.resetDirty()
        setEditAccess(e => !e)
    }, [receiptNote])

    const setData = useCallback((data) => {
        setReceiptNote(data)
        form.setValues(data)
        form.resetDirty()
    }, [])

    const handleDeleteReceiptNote = useCallback(async () => {
        try {
            await Delete(receiptNoteSubcontId, 'receipts/subcont-management')
            successNotif('Delete receipt note subcont success')
            navigate('/home/ppic/warehouse', { replace: true })
        } catch (e) {
            failedNotif(e, 'Delete receipt note subcont failed')
        }
    }, [navigate, receiptNoteSubcontId, successNotif, failedNotif])

    const setDataAfterUpdate = useCallback((updatedData) => {
        const { date, ...rest } = updatedData
        setData({ ...rest, date: new Date(date) })

    }, [setData])

    const handleSubmitEditReceiptNote = useCallback(async (value) => {

        const generatedDataWithImage = generateDataWithImage(value)
        const { date, ...rest } = generatedDataWithImage
        const validated_data = generateDataWithDate(date, rest)

        try {
            const updatedData = await Put(receiptNoteSubcontId, validated_data, 'receipts/subcont-management', 'multipart/form-data')
            setDataAfterUpdate(updatedData)
            successNotif('Edit receipt note subcont success')
            setEditAccess(e => !e)
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Edit receipt note subcont failed')
        }

    }, [receiptNoteSubcontId, setDataAfterUpdate, successNotif, failedNotif])


    useEffect(() => {

        Retrieve(receiptNoteSubcontId, 'receipts/subcont').then(detailReceiptNote => {

            const { date, subcontreceipt_set, supplier, ...restProps } = detailReceiptNote
            const receiptNote = { ...restProps, date: new Date(date), supplier: supplier.id }
            setData(receiptNote)
            setSupplier(supplier)
            setProductReceived(subcontreceipt_set)
        })

    }, [receiptNoteSubcontId, setData])

    const setAddProductReceived = useCallback((newProductReceived) => {
        setProductReceived(prev => [...prev, newProductReceived])
    }, [])

    const setUpdateProductReceived = useCallback((updatedProductReceived) => {
        const { id, quantity, quantity_not_good } = updatedProductReceived

        setProductReceived(prev => prev.map(productReceived => {
            if (productReceived.id === id) {
                return { ...productReceived, quantity: quantity, quantity_not_good: quantity_not_good }
            }
            return productReceived
        }))
    }, [])

    const setDeleteProductReceived = useCallback((idDeletedProductReceived) => {
        setProductReceived(prev => prev.filter(({ id }) => id !== idDeletedProductReceived))
    }, [])


    const links = useMemo(() => [
        {
            "label": "Detail receipt note",
            "link": "detail-receipt-note",
            "order": 1
        },
        {
            "label": 'Product subconstruction received',
            "link": 'product-subcont',
            'order': 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/warehouse',
            label: 'Warehouse'
        },
        {
            path: `/home/ppic/warehouse/subcont-receipt/${receiptNoteSubcontId}`,
            label: 'Detail receipt note'
        }
    ], [receiptNoteSubcontId])

    const contents = [
        {
            description: '',
            component: <SectionDetailReceiptNoteSubcont
                form={form}
                editAccess={editAccess}
                handleClickDeleteButton={() => openConfirmDeleteData(handleDeleteReceiptNote)}
                supplierName={supplier.name}
                handleClickEditButton={handleClickEditButton}
                handleSubmit={handleSubmitEditReceiptNote}
            />
        },
        {
            description: '',
            component: <SectionProductSubcontReceived
                setAddProductReceived={setAddProductReceived}
                setDeleteProductReceived={setDeleteProductReceived}
                setUpdateProductReceived={setUpdateProductReceived}
                productReceived={productReceived}
                receiptNoteSubcontId={receiptNoteSubcontId}
            />
        }
    ]

    return (
        <BaseContent
            contents={contents}
            links={links}
            breadcrumb={breadcrumb}
        />
    )
}

export default DetailSubcontReceipt

