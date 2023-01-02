import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useScrollSpy from 'react-use-scrollspy'
import { Title, Divider, TextInput, Button, Group, Badge, Text, SegmentedControl, Center, Box, HoverCard, NumberInput, Select, Tooltip, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";

import { BaseAside, ExpandedMaterialOrderList, CustomSelectComponentMrp } from "../../layout";
import BreadCrumb from "../../BreadCrumb";
import { sectionStyle } from '../../../styles'
import { useRequest } from "../../../hooks";
import { IconCalendar, IconCodeAsterix, IconUserCheck, IconDownload, IconEdit, IconX, IconTrashX, IconCheck, IconChecks, IconCircleDotted, IconTrash, IconPlus, IconShoppingCart, IconAsset, IconClipboardList, IconClipboardCheck, IconFolderOff, IconReceipt2, IconClipboard, IconReceiptTax, IconDiscount2, IconShieldLock, IconPrinter, IconBarcode, IconCornerDownRightDouble, IconMessages } from "@tabler/icons";
import { FailedNotif, SuccessNotif } from "../../notifications"

import { BaseTable, BaseTableExpanded } from "../../tables"
import MaterialReceiptList from "./MaterialReceiptList"

import { CustomSelectComponentProduct } from "../../layout";
import { PurchaseOrderReport } from "../../outputs";




const ModalEditMaterialOrder = ({ data, setMaterialOrderList }) => {

    const { material, purchase_order_material, to_product, ...rest } = data
    const { Put, Loading } = useRequest()
    const form = useForm({
        initialValues: {
            ...rest,
            material: material.id,
            purchase_order_material: purchase_order_material.id
        }
    })

    const handleSubmit = async (value) => {
        try {
            await Put(data.id, value, 'material-order-management')
            SuccessNotif('Edit material order success')
            closeAllModals()
            setMaterialOrderList(prev => {
                return prev.map(mo => {
                    if (mo.id === data.id) {
                        return { ...mo, ordered: value.ordered, price: value.price }
                    }
                    return mo
                })
            })
        } catch (e) {
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Edit material order failed')
            }
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}  >
            <Loading />

            <TextInput
                label='Material name'
                readOnly
                variant="filled"
                radius='md'
                m='xs'
                icon={<IconAsset />}
                value={material.name}
            />

            <Group
                grow
                m='xs'
            >

                <TextInput
                    label='Pesanan untuk produksi'
                    variant='filled'
                    readOnly
                    radius='md'
                    icon={<IconBarcode />}
                    value={to_product ? to_product.name : ''}
                />


                <TextInput
                    label='Product number'
                    variant='filled'
                    readOnly
                    radius='md'
                    icon={<IconCodeAsterix />}
                    value={to_product ? to_product.code : ''}
                />

            </Group>

            <Group grow m='xs' >

                <NumberInput
                    label='Quantity order'
                    placeholder="Input quantity order"
                    radius='md'
                    hideControls
                    icon={<IconClipboardList />}
                    {...form.getInputProps('ordered')}
                />

                <TextInput
                    label='Quantity arrived'
                    radius='md'
                    variant="filled"
                    icon={<IconClipboardCheck />}
                    readOnly
                    value={form.values.arrived}
                />

                <NumberInput
                    label='Harga / unit'
                    placeholder="Input harga per unit"
                    {...form.getInputProps('price')}
                    radius='md'
                    hideControls
                    required
                    min={0}
                    parser={(value) => value.replace(/Rp\s?|(,*)/g, '')}
                    formatter={(value) =>
                        !Number.isNaN(parseFloat(value))
                            ? `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : 'Rp '
                    }
                    icon={<IconReceipt2 />}
                />

            </Group>

            <Button
                leftIcon={<IconDownload />}
                radius='md'
                fullWidth
                type='submit'
                disabled={form.values.ordered === data.ordered && form.values.price === data.price}
            >
                Save
            </Button>

        </form>
    )
}

const ModalAddMaterialOrder = ({ setAction, idSupplier, idPurchaseOrder }) => {

    const { Retrieve, Loading, Post, RetrieveWithoutExpiredTokenHandler } = useRequest()
    const [materialList, setMaterialList] = useState([])
    const [selectedMaterial, setSelectedMaterial] = useState(null)
    const [ordered, setOrdered] = useState('')
    const [price, setPrice] = useState(0)
    const [mrpList, setMrpList] = useState([])
    const [selectedMrp, setSelectedMrp] = useState(null)
    const [dataToProductList, setDataToProductList] = useState([])
    const [selectedToProduct, setSelectedToProduct] = useState(null)

    useEffect(() => {
        Retrieve(idSupplier, 'supplier-material-list').then(data => {
            setMaterialList(data)
        })
        RetrieveWithoutExpiredTokenHandler(idSupplier, 'mrp').then(data => {
            setMrpList(data)
        })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validate_data = {
            material: selectedMaterial,
            purchase_order_material: idPurchaseOrder,
            ordered: ordered,
            price: price,
            to_product: selectedToProduct
        }
        try {
            await Post(validate_data, 'material-order-management')
            SuccessNotif('Add material order success')
            closeAllModals()
            setAction()
        } catch (e) {
            console.log(e)
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Add material order failed')
            }
        }
    }

    const getRequirementMaterial = useCallback((id_material) => {
        const selectedMaterial = materialList.find(material => material.id === parseInt(id_material))

        if (selectedMaterial) {
            const { ppic_requirementmaterial_related, ppic_requirementmaterialsubcont_related } = selectedMaterial
            return [...ppic_requirementmaterial_related, ...ppic_requirementmaterialsubcont_related]
        }
        return []

    }, [materialList])

    const setChangeDataToProduct = useCallback((value) => {
        const requirementMaterial = getRequirementMaterial(value)
        setDataToProductList(requirementMaterial)
        setSelectedToProduct(null)
    }, [getRequirementMaterial])

    const onChangeMaterial = (value) => {
        setSelectedMaterial(value)
        setChangeDataToProduct(value)
        if (selectedMrp) {
            setSelectedMrp(null)
            setOrdered(undefined)
        }

    }

    const setOnchangeSelectedMrp = (value) => {
        setSelectedMrp(value)
        setSelectedMaterial(value)
        setChangeDataToProduct(value)
        if (value) {
            const mrp = mrpList.find(mr => mr.material.id === parseInt(value))
            setOrdered(mrp.quantity)
        } else {
            setOrdered(undefined)
        }
    }

    return (
        <form onSubmit={handleSubmit} >
            <Loading />

            <Select
                label='Select from request material'
                placeholder="Select material from request"
                radius='md'
                m='xs'
                icon={<IconClipboardList />}
                value={selectedMrp}
                data={mrpList.map(mrp => ({ value: mrp.material.id, label: mrp.material.name, quantity: mrp.quantity, spec: mrp.material.spec, unit: mrp.material.uom }))}
                itemComponent={CustomSelectComponentMrp}
                onChange={setOnchangeSelectedMrp}
                clearable
                searchable
            />

            <Divider my='xs' />

            <Select
                required
                label='Material'
                placeholder="Select material"
                radius='md'
                m='xs'
                clearable
                searchable
                icon={<IconAsset />}
                data={materialList.map(material => ({ value: material.id, label: material.name }))}
                value={selectedMaterial}
                onChange={onChangeMaterial}
            />

            <Select
                label='Untuk produksi product'
                placeholder="Pilih product untuk pengalokasian material"
                value={selectedToProduct}
                clearable
                searchable
                onChange={value => setSelectedToProduct(value)}
                data={dataToProductList.map(data => {
                    const { process, product_subcont } = data
                    if (process) {
                        const { product } = process
                        const { id, name, code } = product
                        return { value: id, label: name, code: code }
                    }
                    const { product } = product_subcont
                    const { id, name, code } = product
                    return { value: id, label: name, code: code }
                })}
                itemComponent={CustomSelectComponentProduct}
                icon={<IconBarcode />}
                radius='md'
                m='xs'
            />

            <Group
                grow
                m='xs'
            >


                <NumberInput
                    required
                    label='Quantity order'
                    placeholder="Input quantity order"
                    radius='md'
                    icon={<IconClipboardList />}
                    hideControls
                    value={ordered}
                    onChange={(value) => {
                        setOrdered(value)
                    }}
                    rightSection={<Text size='xs' color='dimmed' >
                        {selectedMaterial ? materialList.find(material => material.id === parseInt(selectedMaterial)).uom.name : ''}
                    </Text>}
                />

                <NumberInput
                    label='Harga / unit'
                    placeholder="Input harga per unit"
                    value={price}
                    onChange={val => {
                        setPrice(val)
                    }}
                    radius='md'
                    hideControls
                    required
                    min={0}
                    parser={(value) => value.replace(/Rp\s?|(,*)/g, '')}
                    formatter={(value) =>
                        !Number.isNaN(parseFloat(value))
                            ? `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : 'Rp '
                    }
                    icon={<IconReceipt2 />}
                />

            </Group>


            <Button
                leftIcon={<IconDownload />}
                type='submit'
                radius='md'
                fullWidth
            >
                Save
            </Button>
        </form>
    )
}

const ModalEditScheduleReceipt = ({ data, setUpdateSchedule }) => {
    const { Put, Loading } = useRequest()
    const form = useForm({
        initialValues: {
            id: data.id,
            quantity: data.quantity,
            date: new Date(data.date),
            material_order: data.material_order.id,
            fulfilled_quantity: data.fulfilled_quantity
        }
    })

    const handleSubmit = async (value) => {
        let validate_data

        if (value.date) {
            validate_data = { ...value, date: value.date.toLocaleDateString('en-CA') }
        } else {
            validate_data = value
        }

        try {
            const updatedSchedule = await Put(validate_data.id, validate_data, 'material-receipt-schedule-management')
            setUpdateSchedule(updatedSchedule)
            SuccessNotif('Edit schedule success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else if (e.message.data.material_order) {
                FailedNotif(e.message.data.material_order)
            } else {
                FailedNotif('Update schedule failed')
            }
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} >

            <Loading />

            <TextInput
                label='Material'
                radius='md'
                m='xs'
                readOnly
                variant="filled"
                icon={<IconAsset />}
                value={data.material_order.material.name}
            />

            <DatePicker
                required
                label='Schedule date'
                placeholder="Pick schedule date"
                radius='md'
                m='xs'
                icon={<IconCalendar />}
                {...form.getInputProps('date')}
            />

            <Group m='xs' grow >

                <NumberInput
                    hideControls
                    required
                    label='Quantity'
                    placeholder="Input planning quantity material receipt"
                    {...form.getInputProps('quantity')}
                    icon={<IconClipboardList />}
                    radius='md'
                />

                <TextInput
                    label='Quantity arrived'
                    radius='md'
                    readOnly
                    variant="filled"
                    icon={<IconClipboardCheck />}
                    value={form.values.fulfilled_quantity}
                />

            </Group>

            <Button
                leftIcon={<IconDownload />}
                radius='md'
                fullWidth
                type='submit'
            >
                Save
            </Button>

        </form>
    )
}

const ModalAddScheduleReceipt = ({ materialOrderList, changeAction }) => {

    const { Post, Loading } = useRequest()
    const form = useForm({
        initialValues: {
            quantity: undefined,
            date: null,
            material_order: null,
        }
    })

    const handleSubmit = async (value) => {
        let validate_data

        if (value.date) {
            validate_data = { ...value, date: value.date.toLocaleDateString('en-CA') }
        } else {
            validate_data = value
        }

        try {
            await Post(validate_data, 'material-receipt-schedule-management')
            changeAction()
            SuccessNotif('Add schedule success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.material_order) {
                FailedNotif(e.message.data.material_order)
            } else {
                FailedNotif('Add schedule failed')
            }
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} >

            <Loading />

            <Select
                label='Material'
                placeholder="Select material"
                radius='md'
                required
                m='xs'
                data={materialOrderList.map(mat => ({ value: mat.id, label: mat.material.name }))}
                icon={<IconAsset />}
                {...form.getInputProps('material_order')}
            />

            <DatePicker
                required
                label='Schedule date'
                placeholder="Select schedule date"
                radius='md'
                m='xs'
                icon={<IconCalendar />}
                {...form.getInputProps('date')}
            />

            <NumberInput
                label='Quantity'
                placeholder="Input planning quantity receipt"
                radius='md'
                m='xs'
                required
                hideControls
                icon={<IconClipboardList />}
                {...form.getInputProps('quantity')}
            />

            <Button
                leftIcon={<IconDownload />}
                radius='md'
                fullWidth
                type='submit'
            >
                Save
            </Button>

        </form>
    )
}


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
    const { classes } = sectionStyle()
    const [editAccess, setEditAccess] = useState(false)
    const navigate = useNavigate()
    const [materialOrderList, setMaterialOrderList] = useState([])
    const [scheduleList, setScheduleList] = useState([])
    const { Retrieve, Loading, Put, Delete, RetrieveWithoutExpiredTokenHandler } = useRequest()
    const [action, setAction] = useState(0)
    const [detailSupplier, setDetailSupplier] = useState({
        id: '',
        name: '',
        phone: '',
        address: '',
        email: ''

    })
    const [dataForm, setDataForm] = useState(null)
    const [completeStatus, setCompleteStatus] = useState('incomplete')
    const form = useForm({
        initialValues: {
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
        }
    })

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

    const sectionRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ]

    const activeSection = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -80
    })

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


    const columnMaterialOrderList = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.material.name,
            sortable: true
        },
        {
            name: 'Order',
            selector: row => `${row.ordered} ${row.material.uom.name}`
        },
        {
            name: 'Arrived',
            selector: row => `${row.arrived} ${row.material.uom.name}`
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

    const columnScheduleList = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.material_order.material.name,
            sortable: true
        },
        {
            name: 'Date',
            selector: row => <Tooltip
                radius='md'
                label={`${new Date(row.date).toDateString()}`} >
                <Text size='xs'  >
                    {new Date(row.date).toDateString()}
                </Text>
            </Tooltip>
        },
        {
            name: 'Quantity',
            selector: row => `${row.quantity} ${row.material_order.material.uom.name}`
        },
        {
            name: 'Arrived material',
            selector: row => `${row.fulfilled_quantity} ${row.material_order.material.uom.name}`
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
            setDataMoList(materialorder_set)
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

    const changeEditAccess = useCallback(() => {
        return setEditAccess(prev => !prev)
    }, [])


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

    const changeAction = useCallback(() => {
        return setAction(prev => prev + 1)
    }, [])

    const setUpdateSchedule = useCallback((updatedSchedule) => {
        return setScheduleList(schedule => schedule.map(sch => {
            if (sch.id === updatedSchedule.id) {
                return { ...sch, quantity: updatedSchedule.quantity, date: updatedSchedule.date }
            }
            return sch
        }))
    }, [])

    const statusOfPurchaseOrder = useMemo(() => {
        // return true if status of current purchase order is on progress, false if complete
        return materialOrderList.some(mo => mo.ordered > mo.arrived)
    }, [materialOrderList])


    const handleEditPurchaseOrder = useCallback(async (value) => {
        let validate_data

        if (value.date) {
            validate_data = { ...value, date: value.date.toLocaleDateString('en-CA') }
        } else {
            validate_data = value
        }

        try {
            const editedPo = await Put(validate_data.id, validate_data, 'purchase-order-management')
            SuccessNotif('Edit purchase order success')
            setDataPo(editedPo)
        } catch (e) {
            form.setErrors(e.message.data)
            form.setValues(dataForm)
            form.resetDirty()
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else {
                FailedNotif('Edit purchase order failed')
            }
        } finally {
            changeEditAccess()
        }
    }, [dataForm, setDataPo, changeEditAccess])

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

    const openConfirmDeletePo = () => openConfirmModal({
        title: 'Delete purchase order material',
        children: (
            <Text size='sm' >
                Are you sure, data changes will be deleted
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeletePo()
    })

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

    const openConfirmChangeStatusPo = (value) => openConfirmModal({
        title: 'Change status purchase order material',
        children: (
            <Text size='sm' >

                {value === 'incomplete' ? `Ubah status purchase order menjadi on progress, 
                    Apakah anda yakin?, perubahan data akan disimpan.
                `: value === 'complete' ? `Ubah status purchase order manjadi complete,
                Apakah anda yakin?, perubahan data akan disimpan`
                    : `Ubah status purchase order menjadi closed ,
                Apakah anda yakin?, perubahan data akan disimpan dan purchase order TIDAK akan bisa diubah lagi `}

            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleChangeStatusPo(value)
    })

    const openEditMaterialOrder = (data) => openModal({
        title: 'Edit material order',
        radius: 'md',
        size: 'xl',
        children: <ModalEditMaterialOrder data={data} setMaterialOrderList={setMaterialOrderList} />
    })

    const openAddMaterialOrder = () => openModal({
        title: 'Add material order',
        radius: 'md',
        size: 'xl',
        children: <ModalAddMaterialOrder setAction={changeAction} idSupplier={detailSupplier.id} idPurchaseOrder={purchaseOrderId} />
    })

    const handleDeleteMaterialOrder = async (id) => {
        try {
            await Delete(id, 'material-order-management')
            SuccessNotif('Delete material order success')
            setMaterialOrderList(moList => moList.filter(mo => mo.id !== parseInt(id)))
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }

    const handleDeleteSchedule = useCallback(async (id) => {
        try {
            await Delete(id, 'material-receipt-schedule-management')
            SuccessNotif('Delete schedule success')
            setScheduleList(schedules => schedules.filter(sch => sch.id !== parseInt(id)))
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }, [])

    const openConfirmDeleteMaterialOrder = (id) => openConfirmModal({
        title: 'Delete material order',
        children: (
            <Text size='sm' >
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteMaterialOrder(id)
    })

    const openEditSchedule = useCallback((data) => openModal({
        title: 'Edit schedule',
        radius: 'md',
        size: 'xl',
        children: <ModalEditScheduleReceipt data={data} setUpdateSchedule={setUpdateSchedule} />
    }), [setUpdateSchedule])

    const openAddSchedule = useCallback(() => openModal({
        title: 'Add schedule',
        radius: 'md',
        size: 'xl',
        children: <ModalAddScheduleReceipt changeAction={changeAction} materialOrderList={materialOrderList} />
    }), [materialOrderList])

    const openConfirmDeleteSchedule = useCallback((id) => openConfirmModal({
        title: 'Delete material order',
        children: (
            <Text size='sm' >
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteSchedule(id)
    }), [handleDeleteSchedule])



    const setDataMoList = (mo) => {
        // func to set state material order list

        setMaterialOrderList(mo.map(m => ({
            ...m, editButton:

                <Button
                    leftIcon={<IconEdit stroke={2} size={16} />}
                    color='blue.6'
                    variant='subtle'
                    radius='md'
                    mx='xs'
                    onClick={() => openEditMaterialOrder(m)}
                >
                    Edit
                </Button>,
            deleteButton: <Button
                leftIcon={<IconTrash stroke={2} size={16} />}
                color='red'
                variant='subtle'
                radius='md'
                onClick={() => openConfirmDeleteMaterialOrder(m.id)}
            >
                Delete
            </Button>
        })))
    }

    const setDataSchedule = useCallback((scheduleList) => {
        setScheduleList(scheduleList.map(schedule => ({
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
                </Button>,
            deleteButton: <Button
                leftIcon={<IconTrash stroke={2} size={16} />}
                color='red'
                variant='subtle'
                radius='md'
                onClick={() => openConfirmDeleteSchedule(schedule.id)}
            >
                Delete
            </Button>
        })))
    }, [openConfirmDeleteSchedule, openEditSchedule])

    useEffect(() => {

        Retrieve(purchaseOrderId, 'purchase-order').then(data => {
            setDataPo(data)
        })

    }, [action])

    useEffect(() => {

        RetrieveWithoutExpiredTokenHandler(purchaseOrderId, 'material-receipt-schedule').then(data => {
            setDataSchedule(data)
        })

    }, [action])

    return (
        <>

            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            <Loading />

            <section id='detail-purchase-order' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#detail-purchase-order" className={classes.a_href} >
                        Purchase order
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <form id='formEditPurchaseOrder' onSubmit={form.onSubmit(handleEditPurchaseOrder)} >

                    <Group position='apart' mt='md' mb='md'  >

                        <HoverCard
                            width={200}
                            shadow='md'
                        >
                            <HoverCard.Target>
                                <SegmentedControl
                                    value={completeStatus}
                                    onChange={openConfirmChangeStatusPo}
                                    data={[
                                        {
                                            value: 'incomplete', label: (
                                                <Center>
                                                    <IconCircleDotted />
                                                    <Box ml={10} >In progress</Box>
                                                </Center>
                                            ),
                                            disabled: completeStatus === 'closed'
                                        },
                                        {
                                            value: 'complete', label: (
                                                <Center>
                                                    <IconChecks />
                                                    <Box ml={10} >Completed</Box>
                                                </Center>
                                            ),
                                            disabled: statusOfPurchaseOrder || completeStatus === 'closed'
                                        },
                                        {
                                            value: 'closed', label: (
                                                <Center>
                                                    <IconShieldLock />
                                                    <Box ml={10} >Closed</Box>
                                                </Center>
                                            ),
                                            disabled: completeStatus === 'incomplete'
                                        }
                                    ]}
                                    color='blue'
                                    size='md'
                                    radius='md'
                                />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Text size="sm">
                                    {completeStatus === 'complete' ? `Status purchase order is Complete, yang berarti semua perubahan data dilarang ` : completeStatus === 'incomplete' ? `Status purchase order is in progress, yang berarti perubahan data pada purchase order diperbolehkan ` : 'Status purchase order is closed'}
                                </Text>
                            </HoverCard.Dropdown>
                        </HoverCard>


                        <Button.Group >

                            <Button
                                radius='md'
                                size='xs'
                                color={!editAccess ? 'blue.6' : 'red.6'}
                                leftIcon={!editAccess ? <IconEdit /> : <IconX />}
                                onClick={() => {
                                    setEditAccess(prev => !prev)
                                    form.setValues(dataForm)
                                    form.resetDirty()
                                }}
                            >
                                {!editAccess ? 'Edit' : 'Cancel'}
                            </Button>

                            <Button
                                type="submit"
                                size='xs'
                                color='blue.6'
                                form="formEditPurchaseOrder"
                                disabled={form.isDirty() ? false : true}
                                leftIcon={<IconDownload />} >
                                Save Changes</Button>
                            <Button
                                size='xs'
                                color='red.6'
                                disabled={!editAccess ? false : true}
                                radius='md'
                                onClick={openConfirmDeletePo}
                                leftIcon={<IconTrashX />} >
                                Delete</Button>
                        </Button.Group>
                    </Group>


                    <TextInput
                        variant="filled"
                        label='Supplier'
                        radius='md'
                        m='xs'
                        readOnly
                        icon={<IconUserCheck />}
                        value={detailSupplier.name}
                    />

                    <Group grow m='xs' >

                        <TextInput
                            required
                            label='Purchase order number'
                            placeholder="Input purchase order number"
                            radius='md'
                            readOnly={!editAccess}
                            icon={<IconCodeAsterix />}
                            {...form.getInputProps('code')}
                        />

                        <DatePicker
                            label='Order date'
                            placeholder="Pick order date"
                            radius='md'
                            disabled={!editAccess}
                            icon={<IconCalendar />}
                            {...form.getInputProps('date')}
                        />

                    </Group>

                    <Group grow m='xs' >

                        <NumberInput
                            label='Ppn'
                            placeholder="Input ppn dalam persen"
                            radius='md'
                            min={0}
                            hideControls
                            disabled={!editAccess}
                            rightSection={<Text size='sm' color='dimmed' >
                                %
                            </Text>}
                            icon={<IconReceiptTax />}
                            {...form.getInputProps('tax')}
                        />

                        <NumberInput
                            label='Discount'
                            placeholder="Input discount dalam persen"
                            radius='md'
                            disabled={!editAccess}
                            min={0}
                            hideControls
                            rightSection={<Text size='sm' color='dimmed' >
                                %
                            </Text>}
                            icon={<IconDiscount2 />}
                            {...form.getInputProps('discount')}
                        />


                        <TextInput
                            label='Number of material ordered'
                            readOnly
                            icon={<IconShoppingCart />}
                            radius='md'
                            m='xs'
                            variant='filled'
                            value={materialOrderList.length}
                        />

                    </Group>

                    <Textarea
                        label='Keterangan'
                        placeholder="Input keterangan"
                        readOnly={!editAccess}
                        m='xs'
                        radius='md'
                        icon={<IconClipboard />}
                        {...form.getInputProps('description')}
                    />

                    <Group m='sm' >

                        <Badge
                            fullWidth
                            leftSection={completeStatus === 'complete' ?
                                <IconChecks /> : materialOrderList.length === 0 ? <IconFolderOff /> :
                                    statusOfPurchaseOrder ?
                                        <IconCircleDotted /> :
                                        <IconCheck />}

                            variant='filled'
                            color={completeStatus === 'complete' ?
                                'gray' : materialOrderList.length === 0 ? 'gray' :
                                    statusOfPurchaseOrder ?
                                        'cyan.6' :
                                        'blue.6'}
                        >
                            {completeStatus === 'complete' ?
                                'This purchase order is closed' :
                                materialOrderList.length === 0 ? "This purchase order doesn't have any material to order" :
                                    statusOfPurchaseOrder ?
                                        'Material order is in progress' :
                                        'All material orders have been completed'}</Badge>

                    </Group>

                </form>

                <Button
                    leftIcon={<IconPrinter />}
                    onClick={openModalPrintPurchaseOrder}
                    radius='md'
                    fullWidth
                    my='lg'
                >
                    Print
                </Button>

            </section>

            <section id='list-material' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#list-material" className={classes.a_href} >
                        List of ordered material
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <Group
                    m='xs'
                    position="right"
                >

                    <Button
                        variant="outline"
                        leftIcon={<IconPlus />}
                        radius='md'
                        onClick={openAddMaterialOrder}
                    >
                        Material order
                    </Button>

                </Group>

                <BaseTableExpanded
                    column={columnMaterialOrderList}
                    data={materialOrderList}
                    expandComponent={ExpandedMaterialOrderList}
                    noData="This purchase order doesn't have any material to order"
                />

            </section>

            <section id='receipt-schedule' className={classes.section} ref={sectionRefs[2]} >
                <Title className={classes.title} >
                    <a href="#receipt-schedule" className={classes.a_href} >
                        Material receipt schedule
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <Group m='xs' position="right" >
                    <Button
                        radius='md'
                        leftIcon={<IconPlus />}
                        variant='outline'
                        onClick={openAddSchedule}
                    >
                        Schedule
                    </Button>
                </Group>

                <BaseTable
                    column={columnScheduleList}
                    data={scheduleList}
                    noData="There is no data of material receipt schedule"
                />

            </section>

            <section id='related-receipt' className={classes.section} ref={sectionRefs[3]} >
                <Title className={classes.title} >
                    <a href="#related-receipt" className={classes.a_href} >
                        List of received material
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <MaterialReceiptList purchaseOrderId={purchaseOrderId} />

            </section>


        </>
    )

}

export default DetailPurchaseOrder
