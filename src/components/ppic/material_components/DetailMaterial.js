import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRequest, useConfirmDelete, useNotification } from "../../../hooks";
import { useForm } from "@mantine/form";

import { generateDataWithImage } from "../../../services";
import { SectionDetailMaterial, SectionProductionRequirement } from "./detail_material_components";
import { BaseContent } from "../../layout";



const DetailMaterial = () => {

    const { materialId } = useParams() // materialId
    const { successNotif, failedNotif } = useNotification()
    const { Retrieve, Get, Put, Delete } = useRequest()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Material' })
    const [uom, setUom] = useState([])
    const [editAccess, setEditAccess] = useState(false)

    const navigate = useNavigate()
    const [requirementMaterial, setRequirementMaterial] = useState([])
    const [supplier, setSupplier] = useState({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: ''
    })
    const [warehouseMaterial, setWarehouseMaterial] = useState({
        id: '',
        quantity: ''
    })
    const [detailMaterial, setDetailMaterial] = useState({
        id: '',
        image: null,
        length: '',
        name: '',
        spec: '',
        price: 0,
        supplier: '',
        uom: null,
        weight: '',
        width: '',
        thickness: '',
    })

    const form = useForm({
        initialValues: detailMaterial
    })

    const setDataMaterial = useCallback((dataMaterial) => {
        setDetailMaterial(dataMaterial)
        form.setValues(dataMaterial)
        form.resetDirty()
    }, [])

    useEffect(() => {

        const fetch = async () => {
            try {
                const material = await Retrieve(materialId, 'materials-detail')
                const uomList = await Get('uoms')
                const { warehousematerial, supplier, uom, ppic_requirementmaterial_related, ...restDataMaterial } = material

                setUom(uomList)
                setRequirementMaterial(ppic_requirementmaterial_related)
                setSupplier(supplier)
                setWarehouseMaterial(warehousematerial)
                const dataDetailMaterial = { ...restDataMaterial, supplier: supplier.id, uom: uom.id }
                setDataMaterial(dataDetailMaterial)

            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [materialId, setDataMaterial])


    const handleClickEditButton = useCallback(() => {
        form.setValues(detailMaterial)
        form.resetDirty()
        setEditAccess(prev => !prev)
    }, [detailMaterial])

    const handleDelete = useCallback(async () => {
        try {
            await Delete(materialId, 'materials-management')
            successNotif('Delete material success')
            navigate('/home/ppic/material', { replace: true })
        } catch (e) {
            failedNotif(e, 'Delete material failed')
        }
    }, [navigate, materialId, successNotif, failedNotif])

    const handleClickDeleteButton = useCallback(() => openConfirmDeleteData(handleDelete), [openConfirmDeleteData, handleDelete])

    const handleSubmitEditMaterial = useCallback(async (val) => {
        const validate_data = generateDataWithImage(val)

        try {
            const updatedMaterial = await Put(materialId, validate_data, 'materials-management', 'multipart/form-data')
            successNotif('Edit material success')
            setEditAccess(prev => !prev)
            setDataMaterial(updatedMaterial)
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Edit material failed')
        }

    }, [materialId, setDataMaterial, successNotif, failedNotif])


    const links = useMemo(() => [
        {
            "label": "Detail material",
            "link": "detail-material",
            "order": 1
        },
        {
            "label": 'Production requirement',
            "link": 'production-requirement',
            'order': 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/material',
            label: 'Material'
        },
        {
            path: `/home/ppic/material/${materialId}`,
            label: 'Detail material'
        }
    ], [materialId])

    const contents = [
        {
            description: '',
            component: <SectionDetailMaterial
                form={form}
                supplierName={supplier.name}
                stockWarehouse={warehouseMaterial.quantity}
                editAccess={editAccess}
                handleClickDeleteButton={handleClickDeleteButton}
                handleClickEditButton={handleClickEditButton}
                handleSubmit={handleSubmitEditMaterial}
                uomList={uom}
            />
        },
        {
            decription: '',
            component: <SectionProductionRequirement
                requirementMaterialList={requirementMaterial}
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

export default DetailMaterial


