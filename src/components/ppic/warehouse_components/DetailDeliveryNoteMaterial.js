import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRequest } from "../../../hooks";
import BreadCrumb from "../../BreadCrumb";

import { useForm } from "@mantine/form";
import { Button, TextInput, Group, Paper, Select, NumberInput, Textarea, Text, Stack, Center, Divider, Title, UnstyledButton, FileButton, Image } from "@mantine/core";

import { IconEdit, IconTrashX, IconDownload, IconAsset, IconUpload, IconTrash, IconCalendarEvent, IconUserCheck, IconCodeAsterix, IconClipboardCheck, IconPackgeImport, IconArchive, IconShoppingCart, IconSortAscending2, IconPlus } from "@tabler/icons";
import { sectionStyle } from "../../../styles";
import { BaseAside, CustomSelectComponent } from "../../layout";
import useScrollSpy from 'react-use-scrollspy'
import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";
import { FailedNotif, SuccessNotif } from "../../notifications"
import { DatePicker } from "@mantine/dates";


const ModalEditMaterialReceipt = ({ data, setaction, idDn }) => {

    const { Put, Loading } = useRequest()
    const form = useForm({
        initialValues: {
            id: data.id,
            delivery_note_material: idDn,
            material_order: data.material_order.id,
            quantity: data.quantity
        }
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            await Put(value.id, value, 'material-receipt-management')
            SuccessNotif('Edit quantity material receipt succes')
            setaction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            FailedNotif('Edit quantity material receipt failed')
            console.log(e)
        }
    }, [setaction, Put])

    return (
        <>
            <Loading />
            <form onSubmit={form.onSubmit(handleSubmit)} >

                <Group grow my='lg' >

                    <TextInput
                        icon={<IconAsset />}
                        label='Material'
                        radius='md'
                        value={data.material_order.material.name}
                        readOnly
                    />

                    <TextInput
                        icon={<IconCodeAsterix />}
                        label='Purchase order number'
                        radius='md'
                        value={data.material_order.purchase_order_material.code}
                        readOnly
                    />

                </Group>

                <Group grow >


                    <NumberInput
                        icon={<IconShoppingCart />}
                        hideControls
                        radius='md'
                        label='Total quantity order'
                        value={data.material_order.ordered}
                        readOnly
                    />
                    <NumberInput
                        icon={<IconArchive />}
                        hideControls
                        radius='md'
                        label='Total quantity arrived'
                        value={data.material_order.arrived}
                        readOnly
                    />
                </Group>

                <Divider
                    size='xs'
                    variant='dashed'
                    mt='lg'
                    mb='xs'
                />

                <NumberInput
                    icon={<IconPackgeImport />}
                    hideControls
                    label='Quantity'
                    {...form.getInputProps('quantity')}
                    radius='md'
                />

                <Button
                    leftIcon={<IconDownload />}
                    radius='md'
                    fullWidth
                    my='lg'
                    type="submit"
                    disabled={!form.isDirty()}
                >
                    Save
                </Button>

            </form>
        </>
    )
}


const ModalAddMaterialReceipt = ({ setaction, idDn, idSupplier }) => {

    const { Get, Post, Loading } = useRequest()
    const [materialOrderList, setMaterialOrderList] = useState([])
    const [scheduleMaterialReceipt, setScheduleMaterialReceipt] = useState([])
    const [selectSchedule, setSelectSchedule] = useState(null)

    const form = useForm({
        initialValues: {
            delivery_note_material: idDn,
            material_order: null,
            quantity: undefined,
            schedules: null,
        },
        validate: (values) => ({
            material_order: values.material_order === null ? 'This field is required' : null,
            quantity: values.quantity === undefined ? 'This field is required' : null
        })
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            await Post(value, 'material-receipt-management')
            setaction(prev => prev + 1)
            SuccessNotif('Add material received success')
            closeAllModals()
        } catch (e) {
            console.log(e)
            FailedNotif('Add material received failed')
        }
    }, [setaction, Post])

    useEffect(() => {
        Get('material-order-list').then(data => {
            const material_order_list = data.filter(mo => mo.material.supplier.id === parseInt(idSupplier) && mo.purchase_order_material.supplier.id === parseInt(idSupplier))
            setMaterialOrderList(material_order_list)
        })

        Get('material-receipt-schedule').then(data => {
            const scheduleMr = data.filter(schedule => schedule.material_order.material.supplier.id === parseInt(idSupplier) && schedule.material_order.purchase_order_material.supplier.id === parseInt(idSupplier))
            setScheduleMaterialReceipt(scheduleMr)
        })

    }, [Get, idSupplier])

    const handleChangeSelectSchedule = (value) => {
        const schedule = scheduleMaterialReceipt.find(sch => sch.id === parseInt(value))
        setSelectSchedule(value)
        if (value === null) {
            form.setValues({
                delivery_note_material: idDn,
                material_order: null,
                quantity: undefined,
                schedules: null,
            })
        } else {
            form.setValues({
                delivery_note_material: idDn,
                material_order: schedule.material_order.id,
                quantity: schedule.quantity,
                schedules: schedule.id,
            })
        }
    }

    return (
        <>
            <Loading />

            <form onSubmit={form.onSubmit(handleSubmit)}  >


                <Select
                    mt='md'
                    icon={<IconCalendarEvent />}
                    label='Schedule'
                    radius='md'
                    itemComponent={CustomSelectComponent}
                    placeholder="select the arrival of material from schedule"
                    value={selectSchedule}
                    data={scheduleMaterialReceipt.map(schedule => ({ value: schedule.id, label: schedule.material_order.material.name, date: schedule.date, quantity: schedule.quantity, unit: schedule.material_order.material.uom.name }))}
                    clearable
                    searchable
                    nothingFound='Not found'
                    onChange={handleChangeSelectSchedule}

                />

                <Divider my='lg' variant='dashed' ></Divider>


                <Select
                    label='Material'
                    radius='md'
                    icon={<IconAsset />}
                    required
                    searchable
                    placeholder="Select material"
                    data={materialOrderList.map(mo => ({ value: mo.id, label: mo.material.name }))}
                    {...form.getInputProps('material_order')}
                    mb='sm'
                />

                <TextInput
                    icon={<IconCodeAsterix />}
                    label='Purchase order number'
                    radius='md'
                    value={form.values.material_order !== null ? materialOrderList.find(mo => mo.id === parseInt(form.values.material_order)).purchase_order_material.code : ''}
                    readOnly
                    my='sm'
                />



                <Group grow >


                    <NumberInput
                        icon={<IconShoppingCart />}
                        hideControls
                        radius='md'
                        label='Total quantity order'
                        value={form.values.material_order !== null ? materialOrderList.find(mo => mo.id === parseInt(form.values.material_order)).ordered : ''}
                        readOnly
                    />
                    <NumberInput
                        icon={<IconArchive />}
                        hideControls
                        radius='md'
                        label='Total quantity arrived'
                        value={form.values.material_order !== null ? materialOrderList.find(mo => mo.id === parseInt(form.values.material_order)).arrived : ''}
                        readOnly
                    />
                </Group>

                <NumberInput
                    icon={<IconSortAscending2 />}
                    hideControls
                    required
                    label='Quantity'
                    {...form.getInputProps('quantity')}
                    radius='md'
                    my='sm'
                    placeholder="Input arrival quantity"
                />

                <Button
                    radius='md'
                    fullWidth
                    my='lg'
                    leftIcon={<IconDownload />}
                    type="submit"
                    disabled={!form.isDirty()}
                >
                    Save
                </Button>

            </form>

        </>
    )
}



const DetailDeliveryNoteMaterial = () => {

    const navigate = useNavigate()
    const params = useParams() // deliveryNoteMaterialId
    const { classes } = sectionStyle()
    const { Retrieve, Delete, Put, Loading } = useRequest()

    const [action, setAction] = useState(0)
    const [materialReceiptList, setMaterialReceiptList] = useState([])
    const [editable, setEditable] = useState(false)
    const [deliveryNoteMaterial, setDeliveryNoteMaterial] = useState({
        id: params.deliveryNoteMaterialId,
        supplier: '',
        code: '',
        created: '',
        note: '',
        image: null,
        date: ''
    })

    const form = useForm({
        initialValues: {
            id: params.deliveryNoteMaterialId,
            supplier: '',
            code: '',
            created: '',
            note: '',
            image: null,
            date: ''
        }
    })

    const sectionRefs = [
        useRef(null),
        useRef(null),
    ]

    const activeSection = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -80
    })

    const links = [
        {
            "label": "Detail material receipt",
            "link": "#detail-mr",
            "order": 1
        },
        {
            "label": 'Material received',
            "link": '#material-received',
            'order': 1
        },
    ]


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
            path: `/home/ppic/warehouse/material-receipt/${params.deliveryNoteMaterialId}`,
            label: 'Detail material receipt'
        }
    ], [])


    const handleDeleteDeliveryNoteMaterial = useCallback(async (id) => {
        try {
            await Delete(id, 'deliverynote-material-management')
            SuccessNotif('Delete delivery note success')
            navigate('/home/ppic/warehouse')
        } catch (e) {
            console.log(e)
            FailedNotif('Delete delivery note failed')
            FailedNotif(e.message.data)
        }
    }, [navigate])


    const handleDeleteMaterialReceipt = useCallback(async (id) => {
        try {
            await Delete(id, 'material-receipt-management')
            SuccessNotif('Delete material received success')
            setAction(prev => prev + 1)
        } catch (e) {
            console.log(e)
            FailedNotif('Delete material received failed')
            FailedNotif(e.message.data)
        }
    }, [])


    const handleSubmit = useCallback(async (value) => {

        let validated_data
        const { image, date, ...data } = value

        if (typeof image === 'string') {
            // checking type of image field first, to prevent error from content-type in server
            validated_data = data
        } else {
            validated_data = { ...data, image: image }
        }

        if (date) {
            validated_data = { ...validated_data, date: date.toLocaleDateString('en-CA') }
        }

        try {
            await Put(value.id, validated_data, 'deliverynote-material-management', 'multipart/form-data')
            SuccessNotif('Edit material receipt success')
            setAction(prev => prev + 1)
        } catch (e) {
            FailedNotif('Edit material receipt failed')
            form.setValues({ ...deliveryNoteMaterial, supplier: deliveryNoteMaterial.supplier.id, date: new Date(deliveryNoteMaterial.date) })
            console.log(e)
        } finally {
            form.resetDirty()
            setEditable(e => !e)
        }
    }, [deliveryNoteMaterial])

    const openEditMaterialReceipt = useCallback((data) => openModal({
        title: 'Edit quantity material arrival',
        size: 'xl',
        radius: 'md',
        children: <ModalEditMaterialReceipt setaction={setAction} data={data} idDn={params.deliveryNoteMaterialId} />
    }), [])

    const openDeleteMaterialReceipt = useCallback((id) => openConfirmModal({
        title: 'Delete material received',
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteMaterialReceipt(id)
    }), [handleDeleteMaterialReceipt])

    const openDeleteDeliveryNoteMaterial = useCallback((id) => openConfirmModal({
        title: 'Delete delivery note',
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteDeliveryNoteMaterial(id)
    }), [handleDeleteDeliveryNoteMaterial])

    const openSubmitEditDeliveryNoteMaterial = useCallback((value) => openConfirmModal({
        title: 'Edit receipt note material',
        children: (
            <Text size="sm">
                Are you sure?, data will be changed.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, change', cancel: "No, don't change it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit(value)
    }), [handleSubmit])


    const openAddMaterialReceipt = useCallback(() => openModal({
        title: 'Add material receipt',
        radius: 'md',
        size: 'xl',
        children: <ModalAddMaterialReceipt setaction={setAction} idDn={params.deliveryNoteMaterialId} idSupplier={form.values.supplier} />
    }), [form.values.supplier])


    useEffect(() => {

        Retrieve(params.deliveryNoteMaterialId, 'deliverynote-material').then(data => {
            const { materialreceipt_set, ...restProps } = data
            form.setValues({ ...restProps, supplier: restProps.supplier.id, date: new Date(restProps.date) })
            setDeliveryNoteMaterial(restProps)
            setMaterialReceiptList(materialreceipt_set)

        })

    }, [action])



    const materialReceipt = useMemo(() => {

        return materialReceiptList.map((receipt, index) => (
            <Paper key={receipt.id} m='md' p='xs' style={{ border: `1px solid #ced4da` }} radius='md'  >

                <UnstyledButton>
                    <Group>
                        <IconAsset />
                        <div>
                            <Text>Material {index + 1}</Text>
                        </div>
                    </Group>
                </UnstyledButton>

                <Group position="right" >

                    <Button.Group >

                        <Button
                            radius='md'
                            leftIcon={<IconEdit />}
                            color='blue.6'
                            size="xs"
                            onClick={() => openEditMaterialReceipt(receipt)}
                            disabled={receipt.material_order.done}
                        >
                            Edit
                        </Button>

                        <Button
                            disabled={receipt.material_order.done}
                            leftIcon={<IconTrashX />}
                            size="xs"
                            radius='md'
                            color='red.6'
                            onClick={() => openDeleteMaterialReceipt(receipt.id)}
                        >
                            Delete
                        </Button>
                    </Button.Group>
                </Group>

                <Group grow my='lg' >

                    <TextInput
                        icon={<IconAsset />}
                        label='Material'
                        radius='md'
                        value={receipt.material_order.material.name}
                        readOnly
                    />

                    <TextInput
                        icon={<IconCodeAsterix />}
                        label='Purchase order number'
                        radius='md'
                        value={receipt.material_order.purchase_order_material.code}
                        readOnly
                    />

                </Group>

                <Group grow >

                    <NumberInput
                        icon={<IconSortAscending2 />}
                        hideControls
                        label='Quantity'
                        value={receipt.quantity}
                        readOnly
                        radius='md'
                    />

                    <NumberInput
                        icon={<IconShoppingCart />}
                        hideControls
                        radius='md'
                        label='Total quantity order'
                        value={receipt.material_order.ordered}
                        readOnly
                    />
                    <NumberInput
                        icon={<IconArchive />}
                        hideControls
                        radius='md'
                        label='Total quantity arrived'
                        value={receipt.material_order.arrived}
                        readOnly
                    />
                </Group>

            </Paper>
        ))
    }, [materialReceiptList, openEditMaterialReceipt, openDeleteMaterialReceipt])

    return (
        <>

            <BreadCrumb links={breadcrumb} />
            <BaseAside links={links} activeSection={activeSection} />
            <Loading />
            <section id='detail-mr' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#detail-mr" className={classes.a_href} >
                        Detail material receipt
                    </a>
                </Title>
                <Divider my='md' ></Divider>



                <Group position="right" mt='md' mb='md'  >
                    <Button.Group>

                        <Button
                            size='xs'
                            radius='md'
                            color={editable ? 'red.6' : 'blue.6'}
                            leftIcon={editable ? <IconTrashX /> : <IconEdit />}
                            onClick={() => {
                                form.setValues({ ...deliveryNoteMaterial, supplier: deliveryNoteMaterial.supplier.id, date: new Date(deliveryNoteMaterial.date) })
                                form.resetDirty()
                                setEditable(e => !e)
                            }}
                        >
                            {editable ? 'Cancel' : 'Edit'}
                        </Button>

                        <Button
                            size='xs'
                            color='blue.6'
                            type="submit"
                            form="formDeliveryNoteMaterial"
                            disabled={!form.isDirty()}
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red.6'
                            radius='md'
                            disabled={editable}
                            leftIcon={<IconTrashX />}
                            onClick={() => openDeleteDeliveryNoteMaterial(params.deliveryNoteMaterialId)}
                        >
                            Delete</Button>
                    </Button.Group>
                </Group>

                <form id='formDeliveryNoteMaterial' onSubmit={form.onSubmit(openSubmitEditDeliveryNoteMaterial)} >

                    <Stack spacing='xs'>

                        <TextInput
                            icon={<IconUserCheck />}
                            radius='md'
                            label='Supplier'
                            value={deliveryNoteMaterial.supplier.name}
                            readOnly
                        />

                        <DatePicker
                            icon={<IconCalendarEvent />}
                            radius='md'
                            label='Date'
                            disabled={!editable}
                            required
                            placeholder="Select material arrival date"
                            {...form.getInputProps('date')}
                        />

                        <TextInput
                            icon={<IconCodeAsterix />}
                            radius='md'
                            required
                            label='Receipt number'
                            readOnly={!editable}
                            {...form.getInputProps('code')}
                        />

                        <Textarea
                            icon={<IconClipboardCheck />}
                            radius='md'
                            label='Note'
                            readOnly={!editable}
                            {...form.getInputProps('note')}

                        />
                    </Stack>
                </form>

                <Group my='lg' >
                    <Paper>
                        <Image
                            radius='md'
                            src={form.values.image}
                            alt='product image'
                            withPlaceholder
                        />
                    </Paper>

                    <FileButton
                        radius='md'
                        leftIcon={<IconUpload />}
                        style={{ display: !editable ? 'none' : form.values.image === null ? '' : 'none' }}
                        {...form.getInputProps('image')}
                        accept="image/png,image/jpeg" >
                        {(props) => <Button   {...props}>Upload image</Button>}
                    </FileButton>

                    <Button
                        radius='md'
                        leftIcon={<IconTrash />}
                        color='red.7'
                        onClick={() => {
                            form.setFieldValue('image', null)
                            form.setDirty('image')
                        }}
                        style={{ display: !editable ? 'none' : form.values.image !== null ? '' : 'none' }} >
                        Delete image
                    </Button>

                    {form.values.image && (
                        <Text size="sm" color='dimmed' align="center" mt="sm">
                            {form.values.image.name}
                        </Text>
                    )}
                </Group>


            </section>



            <section id='material-received' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#material-received" className={classes.a_href} >
                        Material received
                    </a>
                </Title>
                <Divider my='md' ></Divider>



                {materialReceipt}

                {materialReceipt.length === 0 &&
                    <Text size='sm' align='center' color='dimmed' >
                        This receipt note doesn't have material received
                    </Text>
                }

                <Center>
                    <Button
                        radius='md'
                        onClick={openAddMaterialReceipt}
                        my='lg'
                        leftIcon={<IconPlus />}
                    >
                        Add material received
                    </Button>
                </Center>
            </section>

        </>
    )
}

export default DetailDeliveryNoteMaterial