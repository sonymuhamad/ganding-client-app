import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useScrollSpy from 'react-use-scrollspy'

import { useRequest } from "../../../hooks/useRequest";
import BaseASide from '../../layout/BaseAside'
import { sectionStyle } from "../../../styles/sectionStyle";
import BreadCrumb from "../../BreadCrumb";
import CustomSelectComponent from "../../layout/CustomSelectComponent";
import CustomSelectComponentReceiptSubcont from "../../layout/CustomSelectComponentReceiptSubcont";
import { FailedNotif, SuccessNotif } from "../../notifications/Notifications";
import BaseTableExpanded from '../../tables/BaseTableExpanded'



import { Title, Divider, Button, Text, Group, TextInput, Textarea, FileButton, Stack, Paper, Image, Select, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconTrashX, IconDownload, IconTrash, IconUpload, IconUserCheck, IconClipboardCheck, IconCodeAsterix, IconCalendarEvent, IconPlus, IconBarcode, IconTimeline, IconSortAscending2, IconPackgeImport, IconAssemblyOff, IconRegex } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";



const ModalAddProductReceived = ({ idReceiptNoteSubcont, setAction }) => {

    const { Get, Post } = useRequest()

    const [scheduleList, setScheduleList] = useState([])
    const [productSubcontList, setProductSubcontList] = useState([])

    const [selectedSchedule, setSelectedSchedule] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [quantity, setQuantity] = useState('')
    const [quantityNotGood, setQuantityNotGood] = useState('')

    const selectedProcessName = useMemo(() => {

        if (!selectedProduct) {
            return ''
        }

        return productSubcontList.find(productSubcont => productSubcont.id === parseInt(selectedProduct)).process.process_name

    }, [selectedProduct, productSubcontList])

    const selectedProcessOrder = useMemo(() => {

        if (!selectedProduct) {
            return ''
        }

        const order = productSubcontList.find(productSubcont => productSubcont.id === parseInt(selectedProduct)).process.order
        return `Wip${order}`

    }, [selectedProduct, productSubcontList])


    const fetch = useCallback(async () => {
        try {
            const productSubcontList = await Get('product-subcont-list')
            const schedules = await Get('receipt-subcont-schedule-list')

            setProductSubcontList(productSubcontList)
            setScheduleList(schedules)

        } catch (e) {
            console.log(e)
        }
    }, [Get])

    useEffect(() => {
        fetch()

    }, [fetch])


    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()

        let validated_data

        validated_data = {
            quantity: quantity,
            quantity_not_good: quantityNotGood,
            product_subcont: selectedProduct,
            receipt_note: idReceiptNoteSubcont
        }

        if (selectedSchedule) {
            validated_data = { ...validated_data, schedules: selectedSchedule }
        }

        try {
            await Post(validated_data, 'product-subcont-receipt-management')
            SuccessNotif('Add product received from subconstruction success')
            setAction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else if (e.message.data.product_subcont) {
                FailedNotif(e.message.data.product_subcont)
            } else {
                FailedNotif('Edit product received failed')
            }
        }

    }, [setAction, Post, quantity, quantityNotGood, selectedProduct, selectedSchedule, idReceiptNoteSubcont])



    return (
        <form onSubmit={handleSubmit} >

            <Select
                placeholder="Select from schedule"
                label='Schedule receipt of product subconstruction'
                itemComponent={CustomSelectComponent}
                data={scheduleList.map(schedule => ({ value: schedule.id, label: schedule.product_subcont.product.name, date: schedule.date, quantity: schedule.quantity }))}
                radius='md'
                m='xs'
                icon={<IconCalendarEvent />}
                value={selectedSchedule}
                clearable
                searchable
                nothingFound={'No data'}
                onChange={value => {
                    setSelectedSchedule(value)
                    if (value) {
                        const schedule = scheduleList.find(sched => sched.id === parseInt(value))
                        setSelectedProduct(schedule.product_subcont.id)
                        setQuantity(schedule.quantity)
                    } else {
                        setSelectedProduct(null)
                        setQuantity(0)
                    }
                }
                }
            />


            <Divider />

            <Select
                placeholder="Select product"
                label="Product subconstruction"
                itemComponent={CustomSelectComponentReceiptSubcont}
                data={productSubcontList.map(productSubcont => ({ value: productSubcont.id, label: productSubcont.product.name, order: productSubcont.process.order, code: productSubcont.product.code }))}
                radius='md'
                m='xs'
                searchable
                clearable
                value={selectedProduct}
                onChange={value => {
                    setSelectedProduct(value)
                    if (selectedSchedule) {
                        setSelectedSchedule(null)
                        setQuantity(0)
                    }
                }
                }
                required
                icon={<IconBarcode />}
            />

            <Group grow m='xs' >

                <TextInput
                    label='Process name'
                    readOnly
                    radius='md'
                    icon={<IconTimeline />}
                    value={selectedProcessName}
                />

                <TextInput
                    label='Wip'
                    readOnly
                    radius='md'
                    icon={<IconSortAscending2 />}
                    value={selectedProcessOrder}
                />

            </Group>

            <Group grow m='xs' >

                <NumberInput
                    placeholder="Product received from subconstruction"
                    label='Quantity received'
                    radius='md'
                    value={quantity}
                    onChange={value => setQuantity(value)}
                    icon={<IconPackgeImport />}
                    hideControls
                    required
                    min={0}
                    rightSection={
                        <Text size='sm' color='dimmed' >
                            Pcs
                        </Text>}
                />

                <NumberInput
                    placeholder="Product not good from subconstruction"
                    label='Quantity product not good'
                    radius='md'
                    hideControls
                    required
                    min={0}
                    value={quantityNotGood}
                    onChange={value => setQuantityNotGood(value)}
                    icon={<IconAssemblyOff />}
                    rightSection={
                        <Text size='sm' color='dimmed' >
                            Pcs
                        </Text>}
                />


            </Group>

            <Button
                leftIcon={<IconDownload />}
                fullWidth
                radius='md'
                type='submit'
                my='md'
            >
                Save
            </Button>

        </form>
    )
}

const ModalEditProductReceived = ({ setAction, data }) => {

    const { Loading, Put } = useRequest()

    const form = useForm({
        initialValues: {
            id: '',
            quantity: '',
            quantity_not_good: '',
            product_subcont: '',
            receipt_note: '',
            schedules: ''
        }
    })

    const setData = useCallback(() => {
        const initialData = {
            id: data.id,
            product_subcont: data.product_subcont.id,
            quantity: data.quantity,
            quantity_not_good: data.quantity_not_good,
            receipt_note: data.receipt_note.id,
            schedules: !data.schedules ? null : data.schedules.id
        }
        form.setValues(initialData)

    }, [setAction, data])

    useEffect(() => {
        setData()
    }, [setData])


    const handlesubmitEditProductReceived = useCallback(async (data) => {
        try {
            await Put(data.id, data, 'product-subcont-receipt-management')
            setAction(prev => prev + 1)
            SuccessNotif('Edit product received success')
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else if (e.message.data.product_subcont) {
                FailedNotif(e.message.data.product_subcont)
            } else {
                FailedNotif('Edit product received failed')
            }
        }
    }, [setAction, Put])


    return (
        <form onSubmit={form.onSubmit(handlesubmitEditProductReceived)}  >

            <Loading />

            <TextInput
                value={data.product_subcont.product.name}
                label='Product'
                readOnly
                radius='md'
                m='xs'
                icon={<IconBarcode />}
            />

            <TextInput
                label='Product number'
                readOnly
                radius='md'
                m='xs'
                value={data.product_subcont.product.code}
                icon={<IconRegex />}
            />

            <Group grow m='xs' >
                <TextInput
                    label='Process name'
                    readOnly
                    radius='md'
                    value={data.product_subcont.process.process_name}
                    icon={<IconTimeline />}
                />
                <TextInput
                    label='Wip'
                    readOnly
                    radius='md'
                    value={`Wip${data.product_subcont.process.order}`}
                    icon={<IconSortAscending2 />}
                />
            </Group>


            <Group grow m='xs' >
                <NumberInput
                    label='Quantity product received'
                    {...form.getInputProps('quantity')}
                    radius='md'
                    min={0}
                    icon={<IconPackgeImport />}
                    placeholder="Input product received"
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}
                />

                <NumberInput
                    min={0}
                    label='Product not good'
                    {...form.getInputProps('quantity_not_good')}
                    icon={<IconAssemblyOff />}
                    radius='md'
                    placeholder='Input quantity product not good'
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}
                />
            </Group>

            <Button
                my='md'
                fullWidth
                radius='md'
                leftIcon={<IconDownload />}
                disabled={form.values.quantity === parseInt(data.quantity) && form.values.quantity_not_good === parseInt(data.quantity_not_good)}
                type='submit'
            >
                Save
            </Button>



        </form>
    )
}


const ExpandedReceiptSubcont = ({ data }) => {

    return (
        <Paper p='xs' >

            <TextInput
                m='xs'
                label='Product name'
                value={data.product_subcont.product.name}
                readOnly
                icon={<IconBarcode />}
                radius='md'
                variant='filled'
            />

            <TextInput
                m='xs'
                radius='md'
                readOnly
                label='Product number'
                value={data.product_subcont.product.code}
                icon={<IconRegex />}
                variant='filled'
            />

            <Group m='xs' grow >

                <TextInput

                    radius='md'
                    readOnly
                    label='Process name'
                    value={data.product_subcont.process.process_name}
                    icon={<IconTimeline />}
                    variant='filled'
                />

                <TextInput
                    radius='md'
                    readOnly
                    label='Wip'
                    value={`Wip${data.product_subcont.process.order}`}
                    icon={<IconSortAscending2 />}
                    variant='filled'
                />

            </Group>


            <Group grow m='xs'>
                <TextInput
                    label='Quantity received'
                    radius='md'
                    readOnly
                    value={data.quantity}
                    icon={<IconPackgeImport />}
                    variant='filled'
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}
                />

                <TextInput
                    label='Product not good'
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}
                    variant='filled'
                    icon={<IconAssemblyOff />}
                    readOnly
                    value={data.quantity_not_good}
                    radius='md'
                />
            </Group>


        </Paper>
    )
}



const DetailSubcontReceipt = () => {

    const { receiptNoteSubcontId } = useParams()
    const { Put, Delete, Retrieve, Loading } = useRequest()
    const { classes } = sectionStyle()
    const navigate = useNavigate()

    const [editable, setEditable] = useState(false)
    const [action, setAction] = useState(0)
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
        initialValues: {
            id: '',
            code: '',
            created: '',
            date: null,
            note: '',
            last_update: '',
            image: null,
            supplier: null
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
            "label": "Detail receipt note",
            "link": "#detail-receipt-note",
            "order": 1
        },
        {
            "label": 'Product subconstruction received',
            "link": '#product-subcont',
            'order': 1
        },
    ]

    const breadcrumb = [
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
    ]

    const columnProductReceived = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product_subcont.product.name
        },
        {
            name: 'Quantity received',
            selector: row => row.quantity
        },
        {
            name: '',
            selector: row => row.editButton,

        },
        {
            name: '',
            selector: row => row.deleteButton,
        }
    ], [])


    const handleDeleteProductReceived = useCallback(async (id) => {
        try {
            await Delete(id, 'product-subcont-receipt-management')
            SuccessNotif('Delete product received success')
            setAction(prev => prev + 1)
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }, [])


    const handleDeleteReceiptNote = useCallback(async () => {
        try {
            await Delete(receiptNoteSubcontId, 'receipt-note-subcont-management')
            SuccessNotif('Delete receipt note subconstruction success')
            navigate('/home/ppic/warehouse')
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }, [navigate])

    const handleSubmitEditReceiptNote = useCallback(async (value) => {

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
            await Put(receiptNoteSubcontId, validated_data, 'receipt-note-subcont-management', 'multipart/form-data')
            setAction(prev => prev + 1)
            SuccessNotif('Edit receipt note success')

        } catch (e) {
            console.log(e)
            FailedNotif('Edit receipt note failed')
            form.setValues(receiptNote)
        } finally {
            form.resetDirty()
            setEditable(e => !e)
        }
    }, [receiptNote])

    const openConfirmSubmitEditReceiptNote = useCallback((value) => openConfirmModal({
        title: 'Edit receipt note',
        children: (
            <Text size="sm">
                Are you sure?, data will be changed.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, change', cancel: "No, don't change it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmitEditReceiptNote(value)
    }), [handleSubmitEditReceiptNote])

    const openEditProductReceived = useCallback((data) => openModal({
        title: 'Edit product received',
        radius: 'md',
        size: 'xl',
        children: <ModalEditProductReceived idReceiptNoteSubcont={receiptNoteSubcontId} setAction={setAction} data={data} />
    }), [])

    const openConfirmDeleteReceiptNote = useCallback(() => openConfirmModal({
        title: 'Delete receipt note',
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteReceiptNote()
    }), [handleDeleteReceiptNote])

    const openConfirmDeleteProductReceived = useCallback((id) => openConfirmModal({

        title: 'Delete product received',
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteProductReceived(id)
    }), [handleDeleteProductReceived])


    const openModalAddProductReceived = useCallback(() => openModal({
        title: 'Add product received',
        radius: 'md',
        size: 'xl',
        children: <ModalAddProductReceived idReceiptNoteSubcont={receiptNoteSubcontId} setAction={setAction} />
    }), [])


    const fetch = useCallback(async () => {
        try {
            const detailReceiptNote = await Retrieve(receiptNoteSubcontId, 'receipt-note-subcont')

            const { created, date, last_update, subcontreceipt_set, supplier, ...restProps } = detailReceiptNote
            const receiptNote = { ...restProps, created: new Date(created), date: new Date(date), last_update: !last_update ? '' : new Date(last_update), supplier: supplier.id }

            form.setValues(receiptNote)
            setReceiptNote(receiptNote)
            setSupplier(supplier)

            setProductReceived(subcontreceipt_set.map(received => ({
                ...received, editButton: <Button
                    leftIcon={<IconEdit stroke={2} size={16} />}
                    color='blue.6'
                    variant='subtle'
                    radius='md'
                    onClick={() => openEditProductReceived(received)}
                >
                    Edit
                </Button>, deleteButton: <Button
                    leftIcon={<IconTrash stroke={2} size={16} />}
                    color='red.6'
                    variant='subtle'
                    radius='md'
                    onClick={() => openConfirmDeleteProductReceived(received.id)}
                >
                    Delete
                </Button>
            })))

        } catch (e) {
            console.log(e)
        }
    }, [openEditProductReceived, openConfirmDeleteProductReceived, action])

    useEffect(() => {
        fetch()
    }, [fetch])


    return (
        <>

            <BaseASide activeSection={activeSection} links={links} />
            <BreadCrumb links={breadcrumb} />
            <Loading />


            <section id='detail-receipt-note' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#detail-receipt-note" className={classes.a_href} >
                        Detail receipt note product subconstruction
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
                                form.setValues(receiptNote)
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
                            form="formReceiptNoteSubcont"
                            disabled={!form.isDirty()}
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red.6'
                            radius='md'
                            disabled={editable}
                            leftIcon={<IconTrashX />}
                            onClick={openConfirmDeleteReceiptNote}
                        >
                            Delete</Button>
                    </Button.Group>
                </Group>


                <form id='formReceiptNoteSubcont' onSubmit={form.onSubmit(openConfirmSubmitEditReceiptNote)} >

                    <Stack spacing='xs'>

                        <TextInput
                            icon={<IconUserCheck />}
                            radius='md'
                            label='Supplier'
                            value={supplier.name}
                            readOnly
                        />

                        <DatePicker
                            icon={<IconCalendarEvent />}
                            radius='md'
                            label='Date'
                            disabled={!editable}
                            required
                            placeholder="Select arrival date"
                            {...form.getInputProps('date')}
                        />

                        <TextInput
                            icon={<IconCodeAsterix />}
                            radius='md'
                            required
                            placeholder="Input receipt number"
                            label='Receipt number'
                            readOnly={!editable}
                            {...form.getInputProps('code')}
                        />

                        <Textarea
                            icon={<IconClipboardCheck />}
                            radius='md'
                            label='Receipt description'
                            readOnly={!editable}
                            placeholder='Input receipt informations'
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

            <section id='product-subcont' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#product-subcont" className={classes.a_href} >
                        Product received
                    </a>
                </Title>
                <Divider my='md' ></Divider>

                <Group position="right" m='xs'  >
                    <Button
                        radius='md'
                        leftIcon={<IconPlus />}
                        variant='outline'
                        onClick={openModalAddProductReceived}
                    >
                        Add product
                    </Button>
                </Group>

                <BaseTableExpanded
                    noData="This receipt note doesn't have product received"
                    column={columnProductReceived}
                    data={productReceived}
                    expandComponent={ExpandedReceiptSubcont}
                />

            </section>

        </>
    )
}

export default DetailSubcontReceipt

