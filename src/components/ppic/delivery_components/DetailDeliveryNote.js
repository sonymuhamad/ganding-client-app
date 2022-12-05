import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useScrollSpy from 'react-use-scrollspy'

import { useRequest } from "../../../hooks";
import { sectionStyle } from "../../../styles";
import BreadCrumb from "../../BreadCrumb";
import { SuccessNotif, FailedNotif } from "../../notifications";
import { BaseAside, CustomSelectComponent } from '../../layout'

import { Button, Group, TextInput, Text, Select, Textarea, Title, Divider, Paper, UnstyledButton, NumberInput, Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";
import { IconClipboardCheck, IconUser, IconCodeAsterix, IconPlus, IconCalendarEvent, IconDownload, IconTruckDelivery, IconUserCheck, IconTrashX, IconEdit, IconX, IconBarcode, IconRegex, IconPackgeExport, IconChecklist, IconCalendar } from "@tabler/icons";


const ModalAddProductShipped = ({ idDeliveryNote, setAction }) => {

    const { Post, Get, Loading } = useRequest()
    const [quantity, setQuantity] = useState('')
    const [selectedProductOrder, setSelectedProductOrder] = useState(null)
    const [selectedSchedule, setSelectedSchedule] = useState(null)
    const [errorProductOrder, setErrorProductOrder] = useState(false)

    const [scheduleList, setScheduleList] = useState([])
    const [productOrderList, setProductOrderList] = useState([])

    const fetch = useCallback(async () => {
        try {
            const schedulelist = await Get('delivery-schedule')
            const productorderList = await Get('product-order-list')
            setScheduleList(schedulelist)
            setProductOrderList(productorderList)

        } catch (e) {
            console.log(e)
        }
    }, [Get])

    useEffect(() => {
        fetch()
    }, [fetch])



    const handleAddProductShipped = useCallback(async (e) => {
        e.preventDefault()
        let data
        if (selectedSchedule === null) {

            data = {
                quantity: quantity,
                product_order: selectedProductOrder,
                delivery_note_customer: idDeliveryNote,
            }
        } else {
            data = {
                quantity: quantity,
                product_order: selectedProductOrder,
                delivery_note_customer: idDeliveryNote,
                schedules: selectedSchedule
            }
        }

        try {

            await Post(data, 'product-delivery')
            SuccessNotif('Add product shipped success')
            setAction(prev => prev + 1)
            closeAllModals()
        } catch (e) {

            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
            else if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Add product shipped failed')
            }

            if (e.message.data.product_order) {
                setErrorProductOrder(e.message.data.product_order)
            }
        }
    }, [Post, quantity, selectedProductOrder, selectedSchedule, idDeliveryNote, setAction])

    const handleChangeSelectSchedule = useCallback((value) => {
        const selectedSchedule = scheduleList.find(schedule => schedule.id === parseInt(value))
        setSelectedSchedule(value)

        if (value === null) {
            setQuantity(undefined)
            setSelectedSchedule(null)
            setSelectedProductOrder(null)

        } else {
            setQuantity(selectedSchedule.quantity)
            setSelectedProductOrder(selectedSchedule.product_order.id)
            setSelectedSchedule(selectedSchedule.id)

        }

    }, [scheduleList])

    return (
        <>

            <form onSubmit={handleAddProductShipped} >
                <Loading />

                <Select
                    icon={<IconCalendarEvent />}
                    m='xs'
                    label='Schedule list'
                    placeholder="Select product from schedules"
                    radius='md'
                    value={selectedSchedule}
                    data={scheduleList.map(schedule => ({ value: schedule.id, label: schedule.product_order.product.name, date: schedule.date, quantity: schedule.quantity }))}
                    itemComponent={CustomSelectComponent}
                    clearable
                    searchable
                    nothingFound='Not found'
                    onChange={handleChangeSelectSchedule}
                />

                <Divider variant="dashed" />

                <Select
                    required
                    placeholder="Select product to send"
                    label='Product'
                    radius='md'
                    error={errorProductOrder}
                    icon={<IconBarcode />}
                    m='xs'
                    data={productOrderList.map(productOrder => ({ value: productOrder.id, label: productOrder.product.name }))}
                    value={selectedProductOrder}
                    onChange={val => {
                        setSelectedProductOrder(val)

                        if (selectedSchedule) {
                            setSelectedSchedule(null)
                        }

                    }}
                />

                <TextInput
                    icon={<IconRegex />}
                    readOnly
                    radius='md'
                    m='xs'
                    value={selectedProductOrder !== null ? productOrderList.find(productOrder => productOrder.id === parseInt(selectedProductOrder)).product.code : ''}
                    label='Product number'
                />

                <Group m='xs' grow >

                    <TextInput
                        icon={<IconCodeAsterix />}
                        readOnly
                        radius='md'
                        value={selectedProductOrder !== null ? productOrderList.find(productOrder => productOrder.id === parseInt(selectedProductOrder)).sales_order.code : ''}
                        label='Sales order number'
                    />

                    <TextInput
                        icon={<IconCalendar />}
                        readOnly
                        radius='md'
                        value={selectedProductOrder !== null ? new Date(productOrderList.find(productOrder => productOrder.id === parseInt(selectedProductOrder)).sales_order.date).toDateString() : ''}
                        label='Sales order date'
                    />
                </Group>

                <NumberInput
                    required
                    icon={<IconPackgeExport />}
                    m='xs'
                    placeholder="Input quantity product to send"
                    label='Quantity product shipped'
                    radius='md'
                    value={quantity}
                    onChange={val => setQuantity(val)}
                />

                <Button
                    type='submit'
                    fullWidth
                    radius='md'
                    my='lg'
                    mx='xs'
                    leftIcon={<IconDownload />}
                >
                    Save
                </Button>

            </form>

        </>
    )
}

const ModalEditProductShipped = ({ data, setAction, idDeliveryNote }) => {

    const { Put, Loading } = useRequest()
    const [quantity, setQuantity] = useState('')
    const [errorQuantity, setErrorQuantity] = useState(false)

    useEffect(() => {
        setQuantity(data.quantity)
    }, [data.quantity])

    const handleSubmitEditProductShipped = useCallback(async (e) => {

        e.preventDefault()

        const dataSubmitted = {
            delivery_note_customer: idDeliveryNote,
            quantity: quantity,
            product_order: data.product_order.id,
        }

        try {
            await Put(data.id, dataSubmitted, 'product-delivery')
            SuccessNotif('Edit product shipped success')
            setAction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Edit product shipped failed')
            }
            if (e.message.data.quantity) {
                setErrorQuantity(e.message.data.quantity)
            }
        }

    }, [Put, quantity, idDeliveryNote, data, setAction])

    return (
        <>

            <form onSubmit={handleSubmitEditProductShipped} >

                <Loading />

                <TextInput
                    label='Product name'
                    m='xs'
                    readOnly
                    radius='md'
                    value={data.product_order.product.name}
                    icon={<IconBarcode />}
                />

                <TextInput
                    icon={<IconRegex />}
                    readOnly
                    radius='md'
                    m='xs'
                    value={data.product_order.product.code}
                    label='Product number'
                />

                <Group m='xs' grow >

                    <TextInput
                        icon={<IconCodeAsterix />}
                        readOnly
                        radius='md'
                        value={data.product_order.sales_order.code}
                        label='Sales order number'
                    />

                    <TextInput
                        icon={<IconCalendar />}
                        readOnly
                        radius='md'
                        value={new Date(data.product_order.sales_order.date).toDateString()}
                        label='Sales order date'
                    />
                </Group>

                <NumberInput
                    required
                    icon={<IconPackgeExport />}
                    m='xs'
                    min={0}
                    error={errorQuantity}
                    placeholder='Input quantity product to send'
                    label='Quantity product shipped'
                    radius='md'
                    value={quantity}
                    onChange={val => setQuantity(val)}
                />

                <Button
                    type='submit'
                    fullWidth
                    radius='md'
                    my='lg'
                    mx='xs'
                    leftIcon={<IconDownload />}
                    disabled={quantity === data.quantity}
                >
                    Save
                </Button>
            </form>


        </>
    )
}


const DetailDeliveryNote = () => {

    const params = useParams()
    const { classes } = sectionStyle()
    const { Retrieve, Put, Get, Delete, Loading } = useRequest()
    const navigate = useNavigate()

    const [editAccess, setEditAccess] = useState(false)
    const [action, setAction] = useState(0)
    const [breadcrumb, setBreadCrumb] = useState([])
    const [driverList, setDriverList] = useState([])
    const [vehicleList, setVehicleList] = useState([])

    const [data, setData] = useState({
        id: '',
        code: '',
        note: '',
        customer: {
            id: '',
            name: '',
            address: '',
            phone: '',
            email: ''
        },
        driver: null,
        vehicle: null,
        created: '',
        last_update: '',
        date: '',
        productdelivercustomer_set: [],
    })

    const form = useForm({
        initialValues: {
            id: '',
            code: '',
            note: '',
            customer: '',
            driver: null,
            vehicle: null,
            created: '',
            last_update: '',
            date: '',
        }
    })


    const links = [
        {
            "label": 'Detail delivery note',
            "link": '#detail',
            'order': 1
        },
        {
            "label": "Products shipped",
            "link": "#product-shipped",
            "order": 1
        },
    ]

    const sectionRefs = [
        useRef(null),
        useRef(null),
    ]

    const activeSection = useScrollSpy({
        sectionElementRefs: sectionRefs,
        offsetPx: -80
    })

    const handleDeleteDeliveryNote = useCallback(async () => {
        try {
            await Delete(params.deliveryNoteId, 'delivery-note-management')
            navigate('/home/ppic/delivery')
            SuccessNotif('Delete delivery note success')
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }, [navigate])

    const handleDeleteProductShipped = useCallback(async (id) => {
        try {
            await Delete(id, 'product-delivery')
            setAction(prev => prev + 1)
            SuccessNotif('Delete product shipped success')
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }, [])

    const handleSubmit = useCallback(async (value) => {

        let validated_data
        const { note, date, ...data } = value

        if (note === '') {
            // if note is empty, remove it
            validated_data = data
        } else {
            validated_data = { ...data, note: note }
        }

        if (date) {
            // if date is not empty, set input date format to YYYY-MM-DD, so that be able to inputted to django
            validated_data = { ...validated_data, date: date.toLocaleDateString('en-CA') }
        }

        try {
            await Put(params.deliveryNoteId, validated_data, 'delivery-note-management')
            SuccessNotif('Edit delivery note success')
            setAction(prev => prev + 1)
            setEditAccess(prev => !prev)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit delivery note failed')
            console.log(e)

        }

    }, [])


    const openConfirmSubmit = useCallback((data) => openConfirmModal({
        title: `Edit delivery note`,
        children: (
            <Text size="sm">
                Are you sure?, data will be saved.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit(data)
    }), [handleSubmit])

    const openConfirmDeleteDeliveryNote = useCallback(() => openConfirmModal({
        title: `Delete delivery note`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteDeliveryNote()
    }), [handleDeleteDeliveryNote])

    const openConfirmDeleteProductOrdered = useCallback((id) => openConfirmModal({
        title: `Delete product shipped`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteProductShipped(id)
    }), [handleDeleteProductShipped])


    const fetch = useCallback(async () => {
        try {
            const detailDeliveryNote = await Retrieve(params.deliveryNoteId, 'delivery-note')
            const driverList = await Get('driver')
            const vehicleList = await Get('vehicle')

            const { date, customer, driver, vehicle, ...restProps } = detailDeliveryNote
            setData({ ...restProps, customer: customer, date: new Date(date), vehicle: vehicle.id, driver: driver.id })
            setDriverList(driverList)
            setVehicleList(vehicleList)

            form.setValues({ ...restProps, date: new Date(date), customer: customer.id, vehicle: vehicle.id, driver: driver.id })
            form.resetDirty()
            const breadcrumb = [
                {
                    path: '/home/ppic',
                    label: 'Ppic'
                },
                {
                    path: '/home/ppic/delivery',
                    label: 'Delivery'
                },
                {
                    path: `/home/ppic/delivery/${params.deliveryNoteId}`,
                    label: 'Detail delivery note'
                }
            ]

            setBreadCrumb(breadcrumb)

        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetch()
    }, [fetch, action])

    const openModalAddProductShipped = useCallback(() => openModal({
        title: 'Add product shipped',
        radius: 'md',
        size: 'xl',
        children: <ModalAddProductShipped idDeliveryNote={params.deliveryNoteId} setAction={setAction} />
    }), [])

    const openModalEditProductShipped = useCallback((data) => openModal({
        title: 'Edit product shipped',
        radius: 'md',
        size: 'xl',
        children: <ModalEditProductShipped data={data} setAction={setAction} idDeliveryNote={params.deliveryNoteId} />
    }), [])




    const productDelivered = useMemo(() => {

        return data.productdelivercustomer_set.map((delivered, index) => (

            <Paper key={delivered.id} radius='md' p='xs' m='xs' withBorder  >
                <UnstyledButton>
                    <Group>
                        <IconBarcode />
                        <div>
                            <Text>Product {index + 1}</Text>
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
                            onClick={e => openModalEditProductShipped(delivered)}
                        >
                            Edit
                        </Button>

                        <Button
                            leftIcon={<IconTrashX />}
                            size="xs"
                            radius='md'
                            color='red.6'
                            onClick={() => openConfirmDeleteProductOrdered(delivered.id)}
                            disabled={parseInt(delivered.quantity) > 0}
                        >
                            Delete
                        </Button>
                    </Button.Group>
                </Group>

                <TextInput
                    m='xs'
                    icon={<IconBarcode />}
                    radius='md'
                    readOnly
                    value={delivered.product_order.product.name}
                    label='Product name'

                />

                <TextInput
                    m='xs'
                    icon={<IconRegex />}
                    radius='md'
                    readOnly
                    value={delivered.product_order.product.code}
                    label='Product number'
                />

                <TextInput
                    m='xs'
                    icon={<IconCodeAsterix />}
                    radius='md'
                    readOnly
                    value={delivered.product_order.sales_order.code}
                    label='Sales order number'
                />

                <Group grow m='xs' >


                    <TextInput
                        icon={<IconPackgeExport />}
                        variant='unstyled'
                        radius='md'
                        readOnly
                        value={delivered.quantity}
                        label='Quantity shipped'
                        rightSection={<Text size='sm' color='dimmed' >
                            pcs
                        </Text>}
                    />

                    <TextInput
                        icon={<IconChecklist />}
                        radius='md'
                        readOnly
                        variant="unstyled"
                        value={delivered.product_order.ordered}
                        label='Quantity order'
                        rightSection={<Text size='sm' color='dimmed' >
                            pcs
                        </Text>}
                    />

                    <TextInput
                        icon={<IconTruckDelivery />}
                        radius='md'
                        readOnly
                        variant="unstyled"
                        rightSection={<Text size='sm' color='dimmed' >
                            pcs
                        </Text>}
                        value={delivered.product_order.delivered}
                        label='Total product shipped'
                    />



                </Group>




            </Paper>
        ))
    }, [openConfirmDeleteProductOrdered, openModalEditProductShipped, data])




    return (
        <>

            <BreadCrumb links={breadcrumb} />
            <BaseAside links={links} activeSection={activeSection} />

            <Loading />

            <section id='detail' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#detail" className={classes.a_href} >
                        Detail delivery note
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <Group position="right" mt='md' mb='md'  >
                    <Button.Group>

                        <Button
                            size='xs'
                            radius='md'
                            color={editAccess ? 'red.6' : 'blue.6'}
                            leftIcon={editAccess ? <IconX /> : <IconEdit />}
                            onClick={e => {
                                if (editAccess === true) {
                                    const { customer, ...restProps } = data
                                    form.setValues({ ...restProps, customer: customer.id })
                                    form.resetDirty()
                                }
                                setEditAccess(prev => !prev)
                            }}
                        >
                            {editAccess ? 'Cancel' : 'Edit'}
                        </Button>

                        <Button
                            type="submit"
                            form='formDetailDeliveryNote'
                            size='xs'
                            color='blue.6'
                            disabled={form.isDirty() ? false : true}
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red.6'
                            radius='md'
                            onClick={openConfirmDeleteDeliveryNote}
                            disabled={editAccess ? true : false}
                            leftIcon={<IconTrashX />} >
                            Delete</Button>
                    </Button.Group>
                </Group>

                <form id='formDetailDeliveryNote' onSubmit={form.onSubmit(openConfirmSubmit)} >

                    <TextInput
                        variant="unstyled"
                        icon={<IconUserCheck />}
                        label='Customer'
                        m='xs'
                        radius='md'
                        readOnly
                        value={data.customer.name}
                    />

                    <TextInput
                        icon={<IconCodeAsterix />}
                        m='xs'
                        placeholder="Input delivery number"
                        radius='md'
                        {...form.getInputProps('code')}
                        label='Delivery number'
                        required
                        readOnly={!editAccess}
                    />

                    <DatePicker
                        icon={<IconCalendarEvent />}
                        required
                        label='Delivery date'
                        placeholder="Pick a date"
                        disabled={!editAccess}
                        {...form.getInputProps('date')}
                        radius='md'
                        m='xs'
                    />

                    <Group grow m='xs' >

                        <Select
                            icon={<IconUser />}
                            placeholder="Select Driver"
                            label='Driver name'
                            radius='md'
                            readOnly={!editAccess}
                            data={driverList.map(driver => ({ value: driver.id, label: driver.name }))}
                            {...form.getInputProps('driver')}
                            required
                        />

                        <Select
                            icon={<IconTruckDelivery />}
                            placeholder="Select vehicle number"
                            label='Vehicle number'
                            radius='md'
                            readOnly={!editAccess}
                            data={vehicleList.map(vehicle => ({ value: vehicle.id, label: vehicle.license_part_number }))}
                            {...form.getInputProps('vehicle')}
                            required
                        />

                    </Group>

                    <Textarea
                        icon={<IconClipboardCheck />}
                        m='xs'
                        readOnly={!editAccess}
                        placeholder="Input description notes"
                        label='Description notes'
                        radius='md'
                        {...form.getInputProps('note')}
                    />
                </form>

            </section>

            <section id='product-shipped' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#product-shipped" className={classes.a_href} >
                        Products shipped
                    </a>
                </Title>

                <Divider my='md'></Divider>

                {productDelivered.length === 0 ? <Text color='dimmed' align="center" size='sm' >
                    This delivery note doesn't have product shipped
                </Text> : productDelivered}

                <Center m='md'>
                    <Button
                        radius='md'
                        leftIcon={<IconPlus />}
                        onClick={openModalAddProductShipped}
                    >
                        Add product shipped
                    </Button>
                </Center>

            </section>


        </>
    )

}

export default DetailDeliveryNote


