import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextInput, Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { openConfirmModal, openModal } from "@mantine/modals";
import { IconUserCheck, IconCornerDownRightDouble } from "@tabler/icons";

import { useRequest, useConfirmDelete } from "../../../hooks";
import { FailedNotif, SuccessNotif } from "../../notifications"
import MaterialReceiptList from "./MaterialReceiptList"
import { PurchaseOrderReport } from "../../outputs";
import { SectionDetailPurchaseOrder, SectionMaterialOrder, SectionReceiptSchedule } from "./detail_purchase_order_components";
import { generateDataWithDate, generateDataWithDescription } from "../../../services";
import { BaseContent } from "../../layout";






const ModalInputAdditionalInformationBeforePrint = ({
    data, materialOrderList, dataSupplier
}) => {

    const [name, setName] = useState('')

    const modalPrintPurchaseOrder = () => openModal({
        size: 'auto',
        radius: 'md',
        children: <PurchaseOrderReport
            data={data}
            materialOrderList={materialOrderList}
            dataSupplier={dataSupplier}
            personInChargeName={name}

        />
    })

    const handleSubmit = () => {
        modalPrintPurchaseOrder()
    }

    return (
        <form onSubmit={e => {
            e.preventDefault()
            handleSubmit()
        }} >
            <TextInput
                radius='md'
                value={name}
                onChange={e => setName(e.target.value)}
                m='xs'
                icon={<IconUserCheck />}
                label='Nama penanggung jawab dari supplier'
            />

            <Button
                radius='md'
                fullWidth
                my='lg'
                type='submit'
                leftIcon={<IconCornerDownRightDouble />}
            >
                Submit
            </Button>

        </form>
    )
}



const DetailPurchaseOrder = () => {


    const { purchaseOrderId } = useParams()
    const [editAccess, setEditAccess] = useState(false)
    const navigate = useNavigate()
    const [materialOrderList, setMaterialOrderList] = useState([])
    const { Retrieve, Put, Delete } = useRequest()
    const [detailSupplier, setDetailSupplier] = useState({
        id: '',
        name: '',
        phone: '',
        address: '',
        email: ''

    })
    const [dataForm, setDataForm] = useState({
        id: '',
        code: '',
        supplier: '',
        date: '',
        created: '',
        done: '',
        discount: '',
        tax: '',
        description: '',
        closed: ''
    })
    const [completeStatus, setCompleteStatus] = useState('incomplete')
    const form = useForm({ initialValues: dataForm })
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Purchase order' })

    const openModalPrintPurchaseOrder = () => openModal({
        size: 'lg',
        radius: 'md',
        children: <ModalInputAdditionalInformationBeforePrint
            data={dataForm}
            materialOrderList={materialOrderList}
            dataSupplier={detailSupplier} />
    })

    const setDataPo = useCallback((data) => {
        let dataPurchaseOrder

        if (data.materialorder_set) {
            // if material order set in data

            const { materialorder_set, ...rest } = data
            setMaterialOrderList(materialorder_set)
            dataPurchaseOrder = rest
        } else {
            dataPurchaseOrder = data
        }

        const { supplier, date, done, closed, ...restProps } = dataPurchaseOrder

        setDetailSupplier(supplier)
        const dataForForm = { ...restProps, supplier: supplier.id, date: new Date(date) }

        setStatus(done, closed)

        form.setValues(dataForForm)
        setDataForm(dataForForm)
        form.resetDirty()

    }, [])

    const handleClickEditAccess = useCallback(() => {
        setEditAccess(prev => !prev)
        form.setValues(dataForm)
        form.resetDirty()
    }, [dataForm])


    const setStatus = (statusDone = false, statusClosed = false) => {
        setCompleteStatus(() => {
            if (statusClosed) {
                return 'closed'
            }

            if (statusDone) {
                return 'complete'
            }
            return 'incomplete'
        })
    }


    const statusOfPurchaseOrder = useMemo(() => {
        // return true if status of current purchase order is on progress, false if complete
        return materialOrderList.some(mo => mo.ordered > mo.arrived)
    }, [materialOrderList])

    const handleEditPurchaseOrder = useCallback(async (value) => {
        const { date, ...rest } = value
        const validate_data = generateDataWithDate(date, rest)
        const finalGeneratedData = generateDataWithDescription(validate_data)

        try {
            const editedPo = await Put(purchaseOrderId, finalGeneratedData, 'purchase-order-management')
            SuccessNotif('Edit purchase order success')
            setDataPo(editedPo)
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Edit purchase order failed')

        }
    }, [setDataPo, purchaseOrderId])

    const handleDeletePo = async () => {
        try {
            await Delete(purchaseOrderId, 'purchase-order-management')
            navigate('/home/purchasing/purchase-order')
            SuccessNotif('Delete purcase order material success')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }

    const handleClickDeleteButton = () => openConfirmDeleteData(handleDeletePo)

    const handleClosedPo = async (data) => {
        try {
            await Put(purchaseOrderId, data, 'close-purchase-order-management')
            SuccessNotif('Status purchase order is closed ')
            setStatus(true, true)
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data)
        }
    }

    const handleChangeDonePo = async (data) => {
        const { done } = data
        try {
            await Put(purchaseOrderId, data, 'status-purchase-order-management')
            SuccessNotif('Status purchase order material is changed ')
            setStatus(done, false)
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data)
        }
    }

    const handleChangeStatusPo = (value) => {
        // change status purchase order

        if (value === 'closed') {
            handleClosedPo({ closed: true })
            return
        }

        if (value === 'complete') {
            handleChangeDonePo({ done: true })
            return
        }

        handleChangeDonePo({ done: false })
        return
    }

    const hoverMessage = useMemo(() => {
        if (completeStatus === 'complete') {
            return `Status purchase order is Complete, yang berarti semua perubahan data dilarang `
        }
        if (completeStatus === 'incomplete') {
            return `Status purchase order is in progress, yang berarti perubahan data pada purchase order diperbolehkan `
        }
        return 'Status purchase order is closed'

    }, [completeStatus])

    const getMessage = useCallback((value) => {
        if (value === 'incomplete') {
            return `Ubah status purchase order menjadi on progress, 
            Apakah anda yakin?, perubahan data akan disimpan.`
        }
        if (value === 'complete') {
            return `Ubah status purchase order manjadi complete,
                Apakah anda yakin?, perubahan data akan disimpan`
        }
        return `Ubah status purchase order menjadi closed ,
        Apakah anda yakin?, perubahan data akan disimpan dan purchase order tidak akan bisa diubah lagi `
    }, [])

    const openConfirmChangeStatusPo = (value) => {

        const message = getMessage(value)

        return openConfirmModal({
            title: 'Change status purchase order material',
            children: (
                <Text size='sm' >
                    {message}
                </Text>
            ),
            radius: 'md',
            labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
            cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
            confirmProps: { radius: 'md' },
            onConfirm: () => handleChangeStatusPo(value)
        })
    }

    const setAddMaterialOrder = useCallback((selectedMaterial, selectedToProduct, addedMaterialOrder) => {
        setMaterialOrderList(prev => {
            return [...prev, { ...addedMaterialOrder, material: selectedMaterial, to_product: selectedToProduct }]
        })
    }, [])

    const setEditMaterialOrder = useCallback((updatedMaterialOrder) => {
        const { ordered, price, id } = updatedMaterialOrder

        setMaterialOrderList(prev => {
            return prev.map(mo => {
                if (mo.id === id) {
                    return { ...mo, ordered: ordered, price: price }
                }
                return mo
            })
        })
    }, [])


    const setDeleteMaterialOrder = useCallback((id) => {
        setMaterialOrderList(prevMaterialOrderList => {
            return prevMaterialOrderList.filter(materialOrder => materialOrder.id !== parseInt(id))
        })
    }, [])



    useEffect(() => {

        Retrieve(purchaseOrderId, 'purchase-order').then(data => {
            setDataPo(data)
        })

    }, [purchaseOrderId, setDataPo])

    const contents = [
        {
            description: '',
            component: <SectionDetailPurchaseOrder

                completeStatus={completeStatus}
                statusOfPurchaseOrder={statusOfPurchaseOrder}
                handleChangeStatus={openConfirmChangeStatusPo}
                handleClickDeleteButton={handleClickDeleteButton}
                hoverMessage={hoverMessage}
                amountOfMaterialOrdered={materialOrderList.length}
                handleClickEditButton={handleClickEditAccess}
                form={form}
                editAccess={editAccess}
                supplierName={detailSupplier.name}
                handleClickPrintButton={openModalPrintPurchaseOrder}
                handleEditPurchaseOrder={handleEditPurchaseOrder}
            />
        },
        {
            description: '',
            component: <SectionMaterialOrder
                setAddMaterialOrder={setAddMaterialOrder}
                setEditMaterialOrder={setEditMaterialOrder}
                setDeleteMaterialOrder={setDeleteMaterialOrder}
                materialOrderList={materialOrderList}
                supplierId={detailSupplier.id}
                purchaseOrderId={purchaseOrderId}
            />
        },
        {
            description: '',
            component: <SectionReceiptSchedule
                materialOrderList={materialOrderList}
            />
        },
        {
            description: '',
            component: <MaterialReceiptList purchaseOrderId={purchaseOrderId} />

        }
    ]


    const links = useMemo(() => [
        {
            "label": 'Detail purchase order',
            "link": 'detail-purchase-order',
            'order': 1
        },
        {
            "label": 'List of ordered material',
            "link": 'list-material',
            'order': 1
        },
        {
            "label": 'Material receipt schedule',
            "link": 'receipt-schedule',
            'order': 1
        },
        {
            "label": 'List of related receipt',
            "link": 'related-receipt',
            'order': 1
        },
    ], [])


    const breadcrumb = useMemo(() => [
        {
            path: '/home/purchasing',
            label: 'Purchasing'
        },
        {
            path: '/home/purchasing/purchase-order',
            label: 'Purchase order'
        },
        {
            path: `/home/ppic/purchase-order/${purchaseOrderId}`,
            label: 'Detail purchase order'
        }
    ], [purchaseOrderId])


    return (
        <BaseContent
            links={links}
            breadcrumb={breadcrumb}
            contents={contents}
        />
    )

}

export default DetailPurchaseOrder
