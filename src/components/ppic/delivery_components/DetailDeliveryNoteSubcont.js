import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useScrollSpy from 'react-use-scrollspy'

import { useRequest } from "../../../hooks";
import { BaseAside, CustomSelectComponentProcess, CustomSelectComponentProduct } from "../../layout";
import { sectionStyle } from "../../../styles";
import BreadCrumb from "../../BreadCrumb";
import { SuccessNotif, FailedNotif } from "../../notifications"

import { TextInput, Text, Group, Select, NumberInput, Paper, Divider, Title, Button, Textarea, UnstyledButton, ThemeIcon } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { IconUserCheck, IconTrashX, IconEdit, IconCodeAsterix, IconBarcode, IconClipboardCheck, IconDownload, IconCalendarEvent, IconTruckDelivery, IconUser, IconX, IconPlus, IconSortAscending2, IconTrash, IconRegex, IconPackgeExport, IconTimeline, IconAsset, IconXboxX, IconCircleCheck, IconCircleDotted, IconPackgeImport } from "@tabler/icons";
import { openConfirmModal, closeAllModals, openModal } from "@mantine/modals";

import { BaseTableExpanded, BaseTable } from "../../tables"

const ExpandedDeliveryNoteSubcont = ({ data }) => {

    const columnMaterialUsed = useMemo(() => [
        {
            name: 'Material',
            selector: row => row.material.name
        },
        {
            name: 'Spec',
            selector: row => row.material.spec
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        }
    ], [])

    const columnProductUsed = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name
        },
        {
            name: 'Product number',
            selector: row => row.product.code
        },
        {
            name: 'Quantity',
            selector: row => row.quantity
        }
    ], [])

    return (
        <Paper p='xs' m='xs' withBorder >
            <TextInput
                m='xs'
                icon={<IconBarcode />}
                radius='md'
                readOnly
                value={data.product.name}
                label='Product name'

            />

            <TextInput
                m='xs'
                icon={<IconRegex />}
                radius='md'
                readOnly
                value={data.product.code}
                label='Product number'
            />

            <Group grow m='xs' >

                <TextInput
                    icon={<IconTimeline />}
                    radius='md'
                    readOnly
                    value={data.process.process_name}
                    label='Process'
                />

                <TextInput
                    label='Wip'
                    value={`Wip${data.process.order}`}
                    readOnly
                    radius='md'
                    icon={<IconSortAscending2 />}
                />
            </Group>

            <Group grow m='xs' >

                <TextInput
                    icon={<IconPackgeExport />}
                    variant='unstyled'
                    radius='md'
                    readOnly
                    value={data.quantity}
                    label='Quantity product shipped'
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}
                />

                <TextInput
                    icon={<IconPackgeImport />}
                    variant='unstyled'
                    readOnly
                    value={data.received}
                    label='Quantity product received'
                    rightSection={<Text size='sm' color='dimmed' >
                        Pcs
                    </Text>}

                />

            </Group>

            <Divider m='md' />

            <UnstyledButton >
                <Group>
                    <IconAsset />
                    <div>
                        <Text size='sm' color='dimmed' >Material used in subconstruction</Text>
                    </div>
                </Group>
            </UnstyledButton>

            <BaseTable
                column={columnMaterialUsed}
                data={data.requirementmaterialsubcont_set}
                noData={" This product subcont do not use any material "}
            />

            <Divider m='md' />

            <UnstyledButton>
                <Group>
                    <IconBarcode />
                    <div>
                        <Text size='sm' color='dimmed' >Product assembly used in subconstruction</Text>
                    </div>
                </Group>
            </UnstyledButton>

            <BaseTable
                column={columnProductUsed}
                data={data.requirementproductsubcont_set}
                noData={" This product subcont do not use any product assembly "}
            />

        </ Paper >
    )
}


const ModalAddProductSubcont = ({ setAction, deliveryNoteSubcontId }) => {

    const { Get, Post, Loading } = useRequest()
    const [productList, setProductList] = useState([])
    const [processList, setProcessList] = useState([])

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedProcess, setSelectedProcess] = useState(null)
    const [quantity, setQuantity] = useState('')

    const [errorProduct, setErrorProduct] = useState(false)
    const [errorProcess, setErrorProcess] = useState(false)
    const [errorQuantity, setErrorQuantity] = useState(false)

    const fetch = useCallback(async () => {
        try {
            const productList = await Get('production-subcont-list')
            setProductList(productList)
        } catch (e) {
            console.log(e)
        }
    }, [Get])

    useEffect(() => {
        fetch()
    }, [fetch])



    const handleSubmit = async (e) => {
        e.preventDefault()
        const data =
        {
            deliver_note_subcont: deliveryNoteSubcontId,
            product: selectedProduct,
            process: selectedProcess,
            quantity: quantity
        }

        try {
            await Post(data, 'product-delivery-subcont-management')
            SuccessNotif('Add product subconstruction success')
            setAction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            if (e.message.data) {

                if (e.message.data.product) {
                    setErrorProduct(e.message.data.product)
                }

                if (e.message.data.process) {
                    setErrorProcess(e.message.data.process)
                }

                if (e.message.data.quantity) {
                    setErrorQuantity(e.message.data.quantity)
                }

                if (e.message.data.constructor === Array) {
                    FailedNotif(e.message.data)
                }
                else if (e.message.data.non_field_errors) {
                    FailedNotif(e.message.data.non_field_errors)
                }
                else {
                    FailedNotif('Add product subconstruction failed')
                }

            }

        }
    }


    return (
        <form onSubmit={handleSubmit} >
            <Loading />

            <Select
                m='xs'
                icon={<IconBarcode />}
                label='Product'
                placeholder="Pick a product"
                searchable
                nothingFound="No products"
                radius='md'
                clearable
                error={errorProduct}
                itemComponent={CustomSelectComponentProduct}
                data={productList.map(product => ({ value: product.id, label: product.name, code: product.code, group: product.customer.name }))}
                required
                value={selectedProduct}
                onChange={value => {
                    setSelectedProduct(value)

                    if (value === null) {
                        setProcessList([])
                    } else {
                        const productSelected = productList.find(product => product.id === parseInt(value))
                        const processList = productSelected.ppic_process_related
                        setProcessList(processList)
                    }

                    setSelectedProcess(null)
                }}
            />

            <Select
                m='xs'
                icon={<IconTimeline />}
                label='Process'
                placeholder="Pick a process subcont"
                searchable
                nothingFound=" This product doesn't have process subconstruction "
                radius='md'
                itemComponent={CustomSelectComponentProcess}
                data={processList.map(process => ({ value: process.id, label: process.process_name, order: process.order }))}
                required
                error={errorProcess}
                value={selectedProcess}
                onChange={value => {
                    setSelectedProcess(value)
                }}
            />
            <Group grow m='xs' >

                <TextInput
                    label='Wip'
                    readOnly
                    variant="filled"
                    radius='md'
                    icon={<IconSortAscending2 />}
                    value={selectedProduct !== null & selectedProcess !== null ? processList.find(process => process.id === parseInt(selectedProcess)).order : ''}
                />

                <NumberInput
                    required
                    min={1}
                    error={errorQuantity}
                    hideControls
                    radius='md'
                    label='Quantity shipped'
                    placeholder="Input quantity of product to be sent"
                    value={quantity}
                    onChange={value => {
                        setQuantity(value)
                    }}
                />
            </Group>


            {selectedProcess !== null &&
                <Paper m='xl'  >

                    <UnstyledButton>
                        <Group>
                            <IconAsset />
                            <div>
                                <Text size='sm' color='dimmed' >Material used in subconstruction</Text>
                            </div>
                        </Group>
                    </UnstyledButton>

                    {processList.find(pros => pros.id === parseInt(selectedProcess)).requirementmaterial_set.map(reqMat => (
                        <Group key={reqMat.id} position="apart" >

                            <Group grow my='xs' >

                                <TextInput
                                    radius='md'
                                    label='Material name'
                                    readOnly
                                    value={reqMat.material.name}
                                />

                                <TextInput
                                    radius='md'
                                    label='Stock'
                                    readOnly
                                    value={reqMat.material.warehousematerial}
                                />

                                <TextInput
                                    radius='md'
                                    label='Number of needs'
                                    readOnly
                                    value={quantity === '' || quantity === 0 || quantity === undefined ? 0 :
                                        Math.ceil((quantity / reqMat.output) * reqMat.input)}
                                />

                            </Group>



                            <ThemeIcon
                                radius='xl'
                                mt='md'
                                color={quantity === '' || quantity === 0 || quantity === undefined ? 'blue' :
                                    Math.ceil((quantity / reqMat.output) * reqMat.input) > parseInt(reqMat.material.warehousematerial) ? 'red' : 'blue'}
                            >

                                {quantity === '' || quantity === 0 || quantity === undefined ? <IconCircleDotted /> :
                                    Math.ceil((quantity / reqMat.output) * reqMat.input) > parseInt(reqMat.material.warehousematerial) ? <IconXboxX /> : <IconCircleCheck />
                                }

                            </ThemeIcon>

                        </Group>
                    ))}

                    {processList.find(pros => pros.id === parseInt(selectedProcess)).requirementmaterial_set.length === 0 &&
                        <Text size='sm' align='center' color='dimmed' >
                            This process doesn't have requirement material
                        </Text>
                    }


                </Paper>


            }

            {selectedProcess !== null &&
                <Paper m='xl'  >
                    <UnstyledButton>
                        <Group>
                            <IconBarcode />
                            <div>
                                <Text size='sm' color='dimmed' >Product assembly used</Text>
                            </div>
                        </Group>
                    </UnstyledButton>

                    {processList.find(pros => pros.id === parseInt(selectedProcess)).requirementproduct_set.map(reqProduct => (
                        <Group key={reqProduct.id} spacing='xs' position="apart" >

                            <Group grow my='xs' >

                                <TextInput
                                    radius='md'
                                    label='Product name'
                                    readOnly
                                    value={reqProduct.product.name}
                                />

                                <TextInput
                                    radius='md'
                                    label='Stock'
                                    readOnly
                                    value={reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity}
                                />


                                <TextInput
                                    radius='md'
                                    label='Number of needs'
                                    readOnly
                                    value={quantity === '' || quantity === 0 || quantity === undefined ? 0 :
                                        Math.ceil((quantity / reqProduct.output) * reqProduct.input)}
                                />

                            </Group>



                            <ThemeIcon
                                radius='xl'
                                mt='md'
                                color={quantity === '' || quantity === 0 || quantity === undefined ? 'blue' :
                                    Math.ceil((quantity / reqProduct.output) * reqProduct.input) > parseInt(reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity) ? 'red' : 'blue'}
                            >

                                {quantity === '' || quantity === 0 || quantity === undefined ? <IconCircleDotted /> :
                                    Math.ceil((quantity / reqProduct.output) * reqProduct.input) > parseInt(reqProduct.product.ppic_warehouseproduct_related.find(wh => wh.warehouse_type.id === 1).quantity) ? <IconXboxX /> : <IconCircleCheck />
                                }

                            </ThemeIcon>

                        </Group>
                    ))}

                    {processList.find(pros => pros.id === parseInt(selectedProcess)).requirementproduct_set.length === 0 &&
                        <Text size='sm' align='center' color='dimmed' >
                            This process doesn't have requirement product assembly
                        </Text>
                    }

                </Paper>


            }



            <Button
                fullWidth
                radius='md'
                my='md'
                mx='xs'
                type='submit'
                leftIcon={<IconDownload />}
            >
                Save
            </Button>

        </form>
    )
}

const ModalEditProductSubcont = ({ setAction, data }) => {

    const { Put, Loading } = useRequest()
    const [quantity, setQuantity] = useState(() => {
        return data.quantity
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validated_data = {
            deliver_note_subcont: data.deliver_note_subcont.id,
            product: data.product.id,
            process: data.process.id,
            quantity: quantity
        }
        try {
            await Put(data.id, validated_data, 'product-delivery-subcont-management')
            setAction(prev => prev + 1)
            closeAllModals()
            SuccessNotif('Edit delivery product subconstruction success')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            } else if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Edit delivery product subconstruction failed')
            }
        }
    }


    return (
        <form onSubmit={handleSubmit} >
            <Loading />

            <TextInput
                label='Product'
                readOnly
                value={data.product.name}
                icon={<IconBarcode />}
                variant='unstyled'
                radius='md'
                m='xs'
            />

            <TextInput
                label='Product number'
                readOnly
                value={data.product.code}
                icon={<IconRegex />}
                variant='unstyled'
                radius='md'
                m='xs'
            />

            <NumberInput
                value={quantity}
                label='Quantity of product shipped'
                m='xs'
                radius='md'
                hideControls
                min={0}
                onChange={value => {
                    setQuantity(value)
                }}
            />

            <Button
                radius='md'
                fullWidth
                type='submit'
                leftIcon={<IconDownload />}
            >
                Save
            </Button>

        </form >
    )
}



const DetailDeliveryNoteSubcont = () => {

    const params = useParams()
    const { classes } = sectionStyle()
    const { Get, Retrieve, Put, Delete, Loading } = useRequest()
    const navigate = useNavigate()

    const [action, setAction] = useState(0)
    const [editAccess, setEditAccess] = useState(false)
    const [driverList, setDriverList] = useState([])
    const [vehicleList, setVehicleList] = useState([])
    const [productSubconts, setProductSubcont] = useState([])
    const [dataSupplier, setDataSupplier] = useState({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
    })
    const [data, setData] = useState({
        id: '',
        code: '',
        created: '',
        note: '',
        driver: null,
        vehicle: null,
        supplier: '',
        date: ''
    })

    const form = useForm({
        initialValues: {
            id: '',
            code: '',
            created: '',
            note: '',
            driver: null,
            vehicle: null,
            supplier: '',
            date: ''
        }
    })

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
            path: `/home/ppic/delivery/subcont/${params.deliveryNoteSubcontId}`,
            label: 'Detail delivery subconstruction'
        }
    ]

    const links = [
        {
            "label": 'Detail delivery subconstruction',
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

    const columnProductSubcontShipped = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.product.name
        },
        {
            name: 'Quantity shipped',
            selector: row => `${row.quantity}  Pcs`
        },
        {
            name: '',
            selector: row => row.buttonEdit
        },
        {
            name: '',
            selector: row => row.buttonDelete
        },

    ], [])



    const handleSubmit = useCallback(async (value) => {

        let validated_data
        const { note, date, ...restProps } = value

        if (note === '') {
            // if note is empty, remove it
            validated_data = restProps

        } else {
            validated_data = { ...restProps, note: note }
        }

        if (date) {
            // set input date format to YYYY-MM-DD, so that be able to inputted to django
            validated_data = { ...validated_data, date: date.toLocaleDateString('en-CA') }
        }

        try {
            await Put(params.deliveryNoteSubcontId, validated_data, 'delivery-note-subcont-management')
            SuccessNotif('Edit delivery note success')
            form.reset()
            setAction(prev => prev + 1)
            setEditAccess(prev => !prev)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit delivery note failed')
            console.log(e)

        }

    }, [Put])

    const handleDeleteProductSubcont = useCallback(async (id) => {
        try {
            await Delete(id, 'product-delivery-subcont-management')
            SuccessNotif('Delete delivery product subconstruction success')
            setAction(prev => prev + 1)
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }, [])

    const handleDeleteDeliveryNote = useCallback(async () => {
        try {
            await Delete(params.deliveryNoteSubcontId, 'delivery-note-subcont-management')
            navigate('/home/ppic/delivery')
            SuccessNotif('Delete delivery note success')
        } catch (e) {
            FailedNotif(e.message.data)
        }
    }, [navigate])

    const openConfirmSubmit = useCallback((data) => openConfirmModal({
        title: `Edit delivery subconstruction`,
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

    const openConfirmDeleteDeliveryNoteSubcont = useCallback(() => openConfirmModal({
        title: `Delete delivery subconstruction`,
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


    const openModalAddProductSubcont = useCallback(() => openModal({
        title: 'Add product subconstruction',
        radius: 'md',
        size: 'xl',
        children: <ModalAddProductSubcont setAction={setAction} deliveryNoteSubcontId={params.deliveryNoteSubcontId} />
    }), [])

    const openModalEditProductSubcont = useCallback((data) => openModal({
        title: 'Edit product subconstruction',
        radius: 'md',
        size: 'xl',
        children: <ModalEditProductSubcont setAction={setAction} data={data} />
    }), [])

    const openConfirmDeleteProductSubcont = useCallback((id) => openConfirmModal({
        title: `Delete product subconstruction`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteProductSubcont(id)
    }), [handleDeleteProductSubcont])

    const fetch = useCallback(async () => {

        try {
            const detailDeliveryNoteSubcont = await Retrieve(params.deliveryNoteSubcontId, 'delivery-note-subcont')
            const driverList = await Get('driver')
            const vehcileList = await Get('vehicle')

            const { supplier, driver, date, vehicle, productdeliversubcont_set, ...restProps } = detailDeliveryNoteSubcont
            const detailSubcont = { ...restProps, supplier: supplier.id, driver: driver.id, vehicle: vehicle.id, date: new Date(date) }
            form.setValues(detailSubcont)
            setData(detailSubcont)
            setDataSupplier(supplier)

            setDriverList(driverList)
            setVehicleList(vehcileList)
            form.resetDirty()

            setProductSubcont(productdeliversubcont_set.map(productdeliver => ({
                ...productdeliver, buttonEdit:

                    <Button
                        leftIcon={<IconEdit stroke={2} size={16} />}
                        color='blue.6'
                        variant='subtle'
                        radius='md'
                        mx='xs'
                        onClick={() => openModalEditProductSubcont(productdeliver)}
                    >
                        Edit
                    </Button>,
                buttonDelete: <Button
                    leftIcon={<IconTrash stroke={2} size={16} />}
                    color='red'
                    variant='subtle'
                    radius='md'
                    onClick={() => openConfirmDeleteProductSubcont(productdeliver.id)}
                >
                    Delete
                </Button>
            })))


        } catch (e) {
            console.log(e)
        }
    }
        , [openConfirmDeleteProductSubcont, openModalEditProductSubcont])


    useEffect(() => {
        fetch()
    }, [action, fetch])



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
                                    form.setValues(data)
                                    form.resetDirty()
                                }
                                setEditAccess(prev => !prev)
                            }}
                        >
                            {editAccess ? 'Cancel' : 'Edit'}
                        </Button>

                        <Button
                            size='xs'
                            color='blue.6'
                            type='submit'
                            form='formDetailDeliveryNoteSubcont'
                            disabled={form.isDirty() ? false : true}
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red.6'
                            radius='md'
                            onClick={openConfirmDeleteDeliveryNoteSubcont}
                            disabled={editAccess ? true : false}
                            leftIcon={<IconTrashX />} >
                            Delete</Button>
                    </Button.Group>
                </Group>

                <form id='formDetailDeliveryNoteSubcont' onSubmit={form.onSubmit(openConfirmSubmit)}  >

                    <TextInput
                        variant="unstyled"
                        icon={<IconUserCheck />}
                        label='Supplier'
                        m='xs'
                        radius='md'
                        readOnly
                        value={dataSupplier.name}
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
                        placeholder="Pick delivery date"
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
                        placeholder="Input delivery information"
                        label='Delivery descriptions'
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

                <Group m='md' position="right" >
                    <Button
                        radius='md'
                        leftIcon={<IconPlus />}
                        variant='outline'
                        onClick={openModalAddProductSubcont}
                    >
                        product subconstruction
                    </Button>
                </Group>

                <BaseTableExpanded
                    data={productSubconts}
                    column={columnProductSubcontShipped}
                    expandComponent={ExpandedDeliveryNoteSubcont}
                    noData="This delivery note subconstruction doesn't have any product shipped "
                />


            </section>


        </>
    )
}

export default DetailDeliveryNoteSubcont
