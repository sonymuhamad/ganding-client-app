import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";

import { FailedNotif, SuccessNotif } from "../../notifications";
import { useRequest, useConfirmDelete } from "../../../hooks";
import { SectionDetailSupplier, SectionMaterialList, SectionPurchaseOrderList } from "./detail_supplier_components";
import { BaseContent } from "../../layout";





const DetailSupplier = () => {

    const { supplierId } = useParams()
    const navigate = useNavigate()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Supplier' })
    const { Retrieve, Put, Delete } = useRequest()
    const [detailSupplier, setDetailSupplier] = useState({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
    })

    const [materialList, setMaterialList] = useState([])
    const [purchaseOrderList, setPurchaseOrderList] = useState([])
    const [editAccess, setEditAccess] = useState(false)

    const form = useForm({
        initialValues: detailSupplier
    })

    useEffect(() => {

        const fetch = async () => {
            try {
                const detailSupplier = await Retrieve(supplierId, 'supplier-detail')

                const { ppic_material_related, purchasing_purchaseordermaterial_related, ...restProps } = detailSupplier

                setDetailSupplier(restProps)
                form.setValues(restProps)

                setMaterialList(ppic_material_related)

                setPurchaseOrderList(purchasing_purchaseordermaterial_related)

            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [supplierId])

    const handleClickEditButton = useCallback(() => {

        setEditAccess(prev => !prev)
        form.setValues(detailSupplier)
        form.resetDirty()

    }, [detailSupplier])

    const handleDeleteSupplier = useCallback(async () => {
        try {
            await Delete(supplierId, 'supplier-management')
            navigate('/home/purchasing/suppliers')
            SuccessNotif('Delete supplier success')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [navigate, supplierId])

    const handleClickDeleteButton = useCallback(() => openConfirmDeleteData(handleDeleteSupplier), [handleDeleteSupplier, openConfirmDeleteData])

    const handleEditSupplier = useCallback(async (value) => {
        try {
            await Put(value.id, value, 'supplier-management')
            SuccessNotif('Edit supplier success')
            setDetailSupplier(value)
            form.setValues(value)
            form.resetDirty()
            setEditAccess(prev => !prev)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit supplier failed')
        }
    }, [])


    const links = useMemo(() => [
        {
            "label": 'Detail supplier',
            "link": 'detail',
            'order': 1
        },
        {
            "label": 'Materials',
            "link": 'material',
            'order': 1
        },
        {
            "label": 'Purchase orders',
            "link": 'purchase-order',
            'order': 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/purchasing',
            label: 'Purchasing'
        },
        {
            path: '/home/ppic/suppliers',
            label: 'Suppliers'
        },
        {
            path: `/home/ppic/suppliers/${supplierId}`,
            label: `${detailSupplier.name}`
        },
    ], [detailSupplier, supplierId])


    const contents = [
        {
            description: '',
            component: <SectionDetailSupplier
                form={form}
                editAccess={editAccess}
                handleClickDeleteButton={handleClickDeleteButton}
                handleEdit={handleEditSupplier}
                handleClickEditButton={handleClickEditButton}
            />
        },
        {
            description: '',
            component: <SectionMaterialList
                materialList={materialList}
            />
        },
        {
            description: '',
            component: <SectionPurchaseOrderList
                purchaseOrderList={purchaseOrderList}
            />
        }
    ]

    return (
        <>
            <BaseContent
                links={links}
                breadcrumb={breadcrumb}
                contents={contents}
            />
        </>
    )
}

export default DetailSupplier


