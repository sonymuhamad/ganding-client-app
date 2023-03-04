import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "@mantine/form";

import { useRequest, useConfirmDelete, useNotification } from "../../../hooks";
import { BaseContent } from "../../layout";
import { generateDataWithDate, generateDataWithImage } from "../../../services";
import {
    SectionDetailReceiptNoteMaterial,
    SectionMaterialReceived
} from "./detail_receipt_note_material_components";


const DetailDeliveryNoteMaterial = () => {

    const navigate = useNavigate()
    const { successNotif, failedNotif } = useNotification()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Receipt note material' })
    const { deliveryNoteMaterialId } = useParams()
    const { Retrieve, Delete, Put } = useRequest()
    const [materialReceiptList, setMaterialReceiptList] = useState([])
    const [editAccess, setEditAccess] = useState(false)
    const [supplier, setSupplier] = useState({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: ''
    })
    const [deliveryNoteMaterial, setDeliveryNoteMaterial] = useState({
        id: deliveryNoteMaterialId,
        supplier: '',
        code: '',
        created: '',
        note: '',
        image: null,
        date: ''
    })

    const form = useForm({
        initialValues: deliveryNoteMaterial
    })

    const setData = useCallback((data) => {
        setDeliveryNoteMaterial(data)
        form.setValues(data)
        form.resetDirty()
    }, [])

    const handleClickEditButton = useCallback(() => {
        form.setValues(deliveryNoteMaterial)
        form.resetDirty()
        setEditAccess(e => !e)
    }, [deliveryNoteMaterial])

    const handleDeleteDeliveryNoteMaterial = useCallback(async () => {
        try {
            await Delete(deliveryNoteMaterialId, 'receipts/material-management')
            successNotif('Delete receipt note material success')
            navigate('/home/ppic/warehouse', { replace: true })
        } catch (e) {
            failedNotif(e, 'Delete receipt note material failed')
        }
    }, [navigate, deliveryNoteMaterialId, successNotif, failedNotif])

    const setDataAfterUpdate = useCallback((updatedDeliveryNote) => {
        const { date, ...rest } = updatedDeliveryNote
        setData({ ...rest, date: new Date(date) })
    }, [setData])

    const handleSubmit = useCallback(async (value) => {
        const generatedDataWithImage = generateDataWithImage(value)
        const { date, ...rest } = generatedDataWithImage
        const validated_data = generateDataWithDate(date, rest)

        try {
            const updatedDataDeliveryNoteMaterial = await Put(value.id, validated_data, 'receipts/material-management', 'multipart/form-data')
            setDataAfterUpdate(updatedDataDeliveryNoteMaterial)
            successNotif('Edit receipt note material success')
            setEditAccess(e => !e)
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Edit receipt note material failed')
        }

    }, [setDataAfterUpdate, successNotif, failedNotif])

    useEffect(() => {

        Retrieve(deliveryNoteMaterialId, 'receipts/material').then(data => {
            const { materialreceipt_set, supplier, date, ...restProps } = data
            setMaterialReceiptList(materialreceipt_set)
            setSupplier(supplier)
            const dataDeliveryNoteMaterial = { ...restProps, supplier: supplier.id, date: new Date(date) }
            setData(dataDeliveryNoteMaterial)
        })

    }, [setData, deliveryNoteMaterialId])

    const setAddMaterialReceived = useCallback((newMaterialReceived) => {
        setMaterialReceiptList(prev => [...prev, newMaterialReceived])
    }, [])

    const setUpdateMaterialReceived = useCallback((updatedMaterialReceived) => {
        const { id, quantity } = updatedMaterialReceived
        setMaterialReceiptList(prev => prev.map(materialReceived => {

            if (materialReceived.id === id) {
                return { ...materialReceived, quantity: quantity }
            }
            return materialReceived
        }))

    }, [])

    const setDeleteMaterialReceived = useCallback((idDeletedMaterialReceived) => {
        setMaterialReceiptList(prev => prev.filter(materialReceived => materialReceived.id !== idDeletedMaterialReceived))

    }, [])


    const links = useMemo(() => [
        {
            "label": "Detail material receipt",
            "link": "detail-mr",
            "order": 1
        },
        {
            "label": 'Material received',
            "link": 'material-received',
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
            path: `/home/ppic/warehouse/material-receipt/${deliveryNoteMaterialId}`,
            label: 'Detail material receipt'
        }
    ], [deliveryNoteMaterialId])

    const contents = [
        {
            description: '',
            component: <SectionDetailReceiptNoteMaterial
                supplierName={supplier.name}
                handleClickEditButton={handleClickEditButton}
                handleClickDeletebutton={() => openConfirmDeleteData(handleDeleteDeliveryNoteMaterial)}
                editAccess={editAccess}
                form={form}
                handleSubmit={handleSubmit}
            />
        },
        {
            description: '',
            component: <SectionMaterialReceived
                setAddMaterialReceived={setAddMaterialReceived}
                setDeleteMaterialReceived={setDeleteMaterialReceived}
                setUpdateMaterialReceived={setUpdateMaterialReceived}
                supplierId={supplier.id}
                deliveryNoteMaterialId={deliveryNoteMaterialId}
                materialReceiptList={materialReceiptList}
            />
        }
    ]

    return (
        <BaseContent
            links={links}
            breadcrumb={breadcrumb}
            contents={contents}
        />
    )
}

export default DetailDeliveryNoteMaterial