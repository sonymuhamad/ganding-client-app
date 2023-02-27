import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";

import { useRequest, useConfirmDelete } from "../../../hooks"
import { BaseContent } from "../../layout";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { generateDataWithDate, generateDataWithImage } from "../../../services";
import {
    SectionDetailReceiptNoteSubcont,
    SectionProductSubcontReceived
} from "./detail_receipt_note_subcont_components";



const DetailSubcontReceipt = () => {

    const { receiptNoteSubcontId } = useParams()
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
            await Delete(receiptNoteSubcontId, 'receipt-note-subcont-management')
            SuccessNotif('Delete receipt note subconstruction success')
            navigate('/home/ppic/warehouse')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [navigate, receiptNoteSubcontId])

    const setDataAfterUpdate = useCallback((updatedData) => {
        const { date, ...rest } = updatedData
        setData({ ...rest, date: new Date(date) })

    }, [setData])

    const handleSubmitEditReceiptNote = useCallback(async (value) => {

        const generatedDataWithImage = generateDataWithImage(value)
        const { date, ...rest } = generatedDataWithImage
        const validated_data = generateDataWithDate(date, rest)

        try {
            const updatedData = await Put(receiptNoteSubcontId, validated_data, 'receipt-note-subcont-management', 'multipart/form-data')
            setDataAfterUpdate(updatedData)
            SuccessNotif('Edit receipt note success')
            setEditAccess(e => !e)
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Edit receipt note failed')
        }

    }, [receiptNoteSubcontId, setDataAfterUpdate])


    useEffect(() => {

        Retrieve(receiptNoteSubcontId, 'receipt-note-subcont').then(detailReceiptNote => {

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

