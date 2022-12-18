import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useScrollSpy from 'react-use-scrollspy'
import { Title, Divider, TextInput, Button, Group, Badge, Text, SegmentedControl, Center, Box, HoverCard, NumberInput, Select, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";

import { BaseAside, ExpandedMaterialOrderList, CustomSelectComponentMrp } from "../../layout";
import BreadCrumb from "../../BreadCrumb";
import { sectionStyle } from '../../../styles'
import { useRequest } from "../../../hooks";
import { IconCalendar, IconCodeAsterix, IconUserCheck, IconDownload, IconEdit, IconX, IconTrashX, IconCheck, IconChecks, IconCircleDotted, IconTrash, IconPlus, IconShoppingCart, IconAsset, IconClipboardList, IconClipboardCheck, IconFolderOff } from "@tabler/icons";
import { FailedNotif, SuccessNotif } from "../../notifications"

import { BaseTable, BaseTableExpanded } from "../../tables"
import MaterialReceiptList from "./MaterialReceiptList"



const ModalEditMaterialOrder = ({ data, setMaterialOrderList }) => {

    const { material, purchase_order_material, ...rest } = data
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
                        return { ...mo, ordered: value.ordered }
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

            </Group>

            <Button
                leftIcon={<IconDownload />}
                radius='md'
                fullWidth
                type='submit'
                disabled={form.values.ordered === data.ordered}
            >
                Save
            </Button>

        </form>
    )
}

const ModalAddMaterialOrder = ({ setAction, idSupplier, idPurchaseOrder }) => {

    const { Retrieve, Loading, Post, Get } = useRequest()
    const [materialList, setMaterialList] = useState([])
    const [selectedMaterial, setSelectedMaterial] = useState(null)
    const [ordered, setOrdered] = useState('')
    const [mrpList, setMrpList] = useState([])
    const [selectedMrp, setSelectedMrp] = useState(null)

    useEffect(() => {
        Retrieve(idSupplier, 'supplier-material-list').then(data => {
            setMaterialList(data)
        })
        Get('mrp').then(data => {
            setMrpList(data)
        })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validate_data = {
            material: selectedMaterial,
            purchase_order_material: idPurchaseOrder,
            ordered: ordered
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
                onChange={value => {
                    setSelectedMrp(value)
                    setSelectedMaterial(value)
                    if (value) {
                        const mrp = mrpList.find(mr => mr.material.id === parseInt(value))
                        setOrdered(mrp.quantity)
                    } else {
                        setOrdered(undefined)
                    }
                }}
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
                onChange={(value) => {
                    setSelectedMaterial(value)
                    if (selectedMrp) {
                        setSelectedMrp(null)
                        setOrdered(undefined)
                    }
                }}
            />


            <NumberInput
                required
                label='Quantity order'
                placeholder="Input quantity order"
                radius='md'
                m='xs'
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
                disabled={form.values.quantity === data.quantity}
            >
                Save
            </Button>

        </form>
    )
}

const ModalAddScheduleReceipt = ({ materialOrderList, setNewSchedule }) => {

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
            const newSchedule = await Post(validate_data, 'material-receipt-schedule-management')
            setNewSchedule(newSchedule)
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




const DetailPurchaseOrder = () => {


    const { purchaseOrderId } = useParams()
    const { classes } = sectionStyle()
    const [editAccess, setEditAccess] = useState(false)
    const navigate = useNavigate()
    const [materialOrderList, setMaterialOrderList] = useState([])
    const [scheduleList, setScheduleList] = useState([])
    const { Retrieve, Loading, Put, Delete } = useRequest()
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
            done: ''
        }
    })

    const links = useMemo(() => [
        {
            "label": 'Detail purchase order',
            "link": '#detail-purchase-order',
            'order': 1
        },
        {
            "label": 'List of ordered material',
            "link": '#list-material',
            'order': 1
        },
        {
            "label": 'Material receipt schedule',
            "link": '#receipt-schedule',
            'order': 1
        },
        {
            "label": 'List of related receipt',
            "link": '#related-receipt',
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

        const { supplier, date, done, ...restProps } = dataPurchaseOrder

        setDetailSupplier(supplier)
        const dataForForm = { ...restProps, supplier: supplier.id, date: new Date(date) }

        setStatus(done)

        form.setValues(dataForForm)
        setDataForm(dataForForm)
        form.resetDirty()

    }, [])

    const changeEditAccess = useCallback(() => {
        return setEditAccess(prev => !prev)
    }, [])


    const setStatus = (status) => {
        setCompleteStatus(() => {
            if (status) {
                return 'complete'
            }
            return 'incomplete'
        })
    }

    const changeAction = useCallback(() => {
        return setAction(prev => prev + 1)
    }, [])

    const setNewSchedule = useCallback((newData) => {
        return setScheduleList(prev => [...prev, newData])
    }, [])

    const setUpdateSchedule = useCallback((updatedSchedule) => {
        return setScheduleList(schedule => schedule.map(sch => {
            if (sch.id === updatedSchedule.id) {
                return updatedSchedule
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

    const handleChangeStatusPo = async (value) => {
        // change status purchase order

        let status
        if (value === 'complete') {
            status = true
        } else {
            status = false
        }

        try {
            await Put(purchaseOrderId, { done: status }, 'status-purchase-order-management')
            SuccessNotif('Status purchase order material is changed ')
            setStatus(status)
        } catch (e) {
            console.log(e)
            FailedNotif(e.message.data)
        }
    }

    const openConfirmChangeStatusPo = (e) => openConfirmModal({
        title: 'Change status purchase order material',
        children: (
            <Text size='sm' >
                {completeStatus ? `This action will change status purchase order material to on progress, 
                    Are you sure? data changes will be saved.
                `: `This action will change status purchase order material to Complete,
                Are you sure? data changes will be saved`}
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleChangeStatusPo(e)
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
        children: <ModalAddScheduleReceipt setNewSchedule={setNewSchedule} materialOrderList={materialOrderList} />
    }), [materialOrderList, setNewSchedule])

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

        Retrieve(purchaseOrderId, 'material-receipt-schedule').then(data => {
            setDataSchedule(data)
        })

    }, [])

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
                                            )
                                        },
                                        {
                                            value: 'complete', label: (
                                                <Center>
                                                    <IconChecks />
                                                    <Box ml={10} >Completed</Box>
                                                </Center>
                                            ),
                                            disabled: statusOfPurchaseOrder
                                        },
                                    ]}
                                    color='blue'
                                    size='md'
                                    radius='md'
                                />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Text size="sm">
                                    {completeStatus === 'complete' ? `Currently the order status is closed, click in progress to change status purchase order to in progress, 
                                    it means, open all actions related to this purchase order ` : `Currently the order status is in progress, click completed to change status order to Completed, it means all actions related to this purchase order are CLOSED. including action to material orders `}
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

                    <TextInput
                        label='Purchase order number'
                        placeholder="Input purchase order number"
                        radius='md'
                        m='xs'
                        readOnly={!editAccess}
                        icon={<IconCodeAsterix />}
                        {...form.getInputProps('code')}
                    />

                    <DatePicker
                        label='Order date'
                        placeholder="Pick order date"
                        radius='md'
                        m='xs'
                        disabled={!editAccess}
                        icon={<IconCalendar />}
                        {...form.getInputProps('date')}
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
                                        'yellow.6' :
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
