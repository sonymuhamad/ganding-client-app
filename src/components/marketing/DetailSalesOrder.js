import React, { useState, useEffect, useCallback, useMemo } from "react";

import { IconDotsCircleHorizontal, IconEdit, IconDownload, IconTrashX, IconCodeAsterix, IconCalendar, IconCalendarTime, IconCircleCheck, IconCaretDown, IconCaretRight, IconX, IconCalendarEvent, IconTrash, IconCalendarPlus, IconSum, IconBarcode, IconUser, IconPencil, IconClock2 } from "@tabler/icons";

import { useParams, Link } from "react-router-dom";
import { useRequest, useSection } from "../../hooks";
import { BaseTableExpanded } from "../tables";
import { Button, Group, TextInput, Checkbox, Title, Stack, Progress, Text, ActionIcon, Collapse, CloseButton, NumberInput, Center, NativeSelect, Tooltip, Mark } from "@mantine/core";
import BreadCrumb from "../BreadCrumb";
import { DatePicker } from "@mantine/dates";
import { salesorderStyle } from "../../styles";
import { BaseAside, ExpandedDeliveryNote } from "../layout";
import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from "../notifications";
import { openConfirmModal } from "@mantine/modals";
import { useNavigate } from "react-router-dom";


const DetailSalesOrder = () => {

    const params = useParams() // salesOrderId
    const navigate = useNavigate()
    const { classes } = salesorderStyle()
    const { sectionRefs, activeSection } = useSection()
    const { Retrieve, Post, Delete, Put, Loading } = useRequest()

    const [salesOrder, setSalesOrder] = useState({
        id: '',
        customer: '',
        code: '',
        fixed: '',
        done: '',
        date: '',
    })
    const [openButtonSo, setOpenButtonSo] = useState({ label: 'Edit', color: 'blue.6' })
    const [disableEditSo, setDisableEditSo] = useState(true)

    const [productOrder, setProductOrder] = useState([])
    const [openButtonPo, setOpenButtonPo] = useState({ label: 'Edit', color: 'blue.6' })
    const [open, setOpened] = useState([])
    const [editAccess, setEditAcces] = useState(null)
    const [action, setAction] = useState(0)
    const [products, setProducts] = useState([])
    const [deliveryNote, setDeliveryNote] = useState({})

    const form = useForm(
        {
            initialValues: {
                id: '',
                customer: '',
                code: '',
                fixed: '',
                done: '',
                date: '',
                created: '',
                presentage: '',
                customerName: '',
            }
        }
    )

    const productOrderForm = useForm({
        initialValues: {
            productorder_set: [
                {
                    sales_order: '',
                    product: '',
                    ordered: '',
                    delivered: '',
                    deliveryschedule_set: [
                        {
                            quantity: '',
                            date: ''
                        }
                    ],
                    done: '',
                    id: '',
                }
            ]
        },
        validate: {
            productorder_set: {
                deliveryschedule_set: {
                    date: (value) => (value === '' ? 'This fields is required' : null)
                }
            }
        }
    })


    const columnDeliveryNote = useMemo(() => [
        // columns for product tables
        {
            name: 'Code',
            selector: row => row.code,
        },
        {
            name: 'Date',
            selector: row => new Date(row.created).toLocaleString(),
            sortable: true
        },
        {
            name: 'Driver',
            selector: row => row.driver.name,
        },
        {
            name: 'Vehicle code',
            selector: row => row.vehicle.license_part_number,
        },
        {
            name: '',
            selector: row => row.buttonDetail,
            style: {
                padding: 0,
            }
        }

    ], [])

    const links = [
        {
            "label": "Detail sales order",
            "link": "#sales-order",
            "order": 1
        },
        {
            "label": "Ordered products",
            "link": "#product-order",
            "order": 1
        },
        {
            "label": "Delivery notes",
            "link": "#delivery-note",
            "order": 1
        }
    ]

    const breadcrumb = [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/sales-order',
            label: 'Sales order'
        },
        {
            path: `/home/marketing/sales-order/${params.salesOrderId}`,
            label: 'Detail'
        }
    ]


    const handleClickEditButton = useCallback(async () => {
        setOpenButtonSo((prev) => {
            if (prev.color === 'blue.6') {
                return { color: 'red.6', label: 'Cancel' }
            } else if (prev.color === 'red.6') {
                return { color: 'blue.6', label: 'Edit' }
            }

        })
        setDisableEditSo((t) => !t)
    }, [])


    const handleEditSo = useCallback(async (salesOrder) => {
        salesOrder.date = salesOrder.date.toLocaleDateString('en-CA')
        try {
            await Put(params.salesOrderId, salesOrder, 'sales-order-management')
            SuccessNotif('Sales order has been updated')
            setAction(prev => prev + 1)
        } catch (e) {
            form.setErrors({ ...e.message.data })
            if (e.message.data) {
                FailedNotif(e.message.data[0])
            }
        } finally {
            handleClickEditButton()
        }
    }, [params.salesOrderId, Put, handleClickEditButton])

    const handleDeleteSo = useCallback(async () => {
        try {
            await Delete(params.salesOrderId, 'sales-order-management')
            SuccessNotif('Sales order has been deleted')
            navigate('/home/marketing/sales-order')
        } catch (e) {
            if (e.message.data) {
                FailedNotif(e.message.data[0])
            }
        }

    }, [Delete, params.salesOrderId, navigate])

    const changeStatusSo = useCallback(async () => {
        const salesOrder = form.values
        salesOrder.fixed = !salesOrder.fixed
        salesOrder.date = salesOrder.date.toLocaleDateString('en-CA')
        try {
            await Put(salesOrder.id, salesOrder, 'sales-order-management')
            SuccessNotif('Sales order status has been changed')
        } catch (e) {
            FailedNotif('Update status failed')
            salesOrder.fixed = !salesOrder.fixed
        }
    }, [Put, form.values])


    const handleDeletePo = useCallback(async (id, index) => {

        try {
            if (id === '') {
                productOrderForm.removeListItem(`productorder_set`, index)
            } else {
                await Delete(id, 'product-order-management')
                SuccessNotif('Product order has been updated')
                setAction(prev => prev + 1)
            }
        } catch (e) {
            FailedNotif(e.message.data[0])
        }
    }, [Delete, productOrderForm])


    const handleSubmitPo = useCallback(async () => {

        const editedPo = productOrderForm.values.productorder_set.filter((po, index) => productOrderForm.isDirty(`productorder_set.${index}`))[0]

        editedPo.deliveryschedule_set = editedPo.deliveryschedule_set.map((schedule) => ({ quantity: schedule.quantity, date: schedule.date.toLocaleDateString('en-CA') }))

        try {
            if (editedPo.id === '') {
                await Post(editedPo, 'product-order-management')
                SuccessNotif('Product order has been added')
            } else {
                await Put(editedPo.id, editedPo, 'product-order-management')
                SuccessNotif('Product order has been updated')
            }

        } catch (e) {
            form.setErrors({ ...e.message.data })

            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors[0])
            }
            if (e.message.data.deliveryschedule_set) {
                FailedNotif(e.message.data.deliveryschedule_set[0])
            }

            console.log(e)
        } finally {
            setAction(prev => prev + 1)
            setOpenButtonPo((prev) => {
                if (prev.color === 'blue.6') {
                    return { color: 'red.6', label: 'Cancel' }
                } else if (prev.color === 'red.6') {
                    return { color: 'blue.6', label: 'Edit' }
                }

            })
            setEditAcces(null)
        }

    }, [productOrderForm, form, Post, Put])


    const openModalChangeStatus = useCallback(() => openConfirmModal({
        title: `change status of sales order`,
        children: (
            <Text size="sm">
                Are you sure?, status of sales order will changed.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, change it', cancel: "No, don't change it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => changeStatusSo(),
    }), [changeStatusSo])

    useEffect(() => {
        const fetch = async () => {

            try {
                const salesorder = await Retrieve(params.salesOrderId, 'sales-order-list')

                const po = salesorder.productorder_set.map((product, index) => {
                    return ({
                        ...product,
                        index: index,
                        sales_order: params.salesOrderId,
                        product: product.product.id,
                        deliveryschedule_set: product.deliveryschedule_set.map(schedule => ({ ...schedule, date: new Date(schedule.date) }))
                    }
                    )
                })

                const deliveryNotes = salesorder.productorder_set.reduce((prev, current) => {

                    // algorithm for gather product delivery from product order based on its delivery note, 
                    // return delivery notes and its particular product delivery 

                    let temp = prev

                    for (const productDeliver of current.productdelivercustomer_set) {

                        // loop every product delivery from product order

                        const idDn = productDeliver.delivery_note_customer.id // delivery note

                        const { delivery_note_customer, ...restProps } = productDeliver
                        const { product } = current
                        const pdeliver = { ...restProps, product: product }

                        if (prev.hasOwnProperty(idDn)) {

                            // if delivery note has been seen
                            // stick product delivery to this delivery note 

                            temp[idDn].productdelivercustomer_set.push(pdeliver)

                        } else {

                            temp[idDn] = delivery_note_customer

                            temp[idDn]['buttonDetail'] = <Button

                                leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                                color='teal.8'
                                variant='subtle'
                                radius='md'
                                component={Link}
                                to={`/home/marketing/delivery-note/${idDn}`}
                            >
                                Detail
                            </Button>

                            temp[idDn].productdelivercustomer_set = [pdeliver]
                        }
                    }
                    return temp

                }, {})

                setDeliveryNote(deliveryNotes)


                const products = await Retrieve(salesorder.customer.id, 'product-customer')
                setProducts(products.ppic_product_related)

                const created = new Date(salesorder.created)
                const so = {
                    id: salesorder.id,
                    date: new Date(salesorder.date),
                    fixed: salesorder.fixed,
                    done: salesorder.done,
                    created: created.toString(),
                    code: salesorder.code,
                    presentage: Math.round(((salesorder.productdelivered / salesorder.productordered) * 100) * 10) / 10,
                    customer: salesorder.customer.id,
                    customerName: salesorder.customer.name,
                    productorder_set: []
                }
                form.setValues(so)
                setSalesOrder(so)

                productOrderForm.setFieldValue('productorder_set', po)
                setProductOrder(po)

                form.resetDirty()
                productOrderForm.resetDirty()
            } catch (e) {
                console.log(e)
            }

        }
        fetch()
    }, [action, Retrieve, params.salesOrderId])


    const openModalDeleteSo = useCallback(() => openConfirmModal({
        title: `Delete sales order`,
        children: (
            <Text size="sm">
                Are you sure?, deleted data cannot be recovered.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteSo(),
    }), [handleDeleteSo])

    const openModalDeletePo = useCallback((id, token, endpoint, index) => openConfirmModal({
        title: `Delete Product Order`,
        children: (
            <Text size="sm">
                Are you sure?, deleted data cannot be recovered.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeletePo(id, token, endpoint, index),
    }), [handleDeletePo])


    const contentProductOrder = useMemo(() => {
        return productOrderForm.values.productorder_set.map((po, index) => (


            <div key={index} >
                <Text size='xl' m='sm' >Product {index + 1}</Text>
                <Button.Group style={{ float: 'right' }}  >
                    <Button
                        size='xs'
                        radius='md'
                        color={openButtonPo.color}
                        leftIcon={!editAccess ? <IconEdit /> : editAccess === index + 1 ? <IconX /> : <IconEdit />}
                        disabled={!editAccess ? editAccess : editAccess !== index + 1}
                        onClick={() => {
                            setOpenButtonPo((prev) => {
                                if (prev.color === 'blue.6') {
                                    return { color: 'red.6', label: 'Cancel' }
                                } else if (prev.color === 'red.6') {
                                    return { color: 'blue.6', label: 'Edit' }
                                }

                            })
                            setEditAcces(access => {
                                if (!access) {
                                    return index + 1
                                } else {
                                    return null
                                }
                            })
                            if (productOrderForm.isDirty(`productorder_set.${index}`)) {
                                productOrderForm.resetDirty(`productorder_set.${index}`)
                                productOrderForm.setFieldValue('productorder_set', productOrder)
                            }

                        }}
                    >
                        {!editAccess ? openButtonPo.label : editAccess === index + 1 ? openButtonPo.label : 'Edit'}
                    </Button>

                    <Button
                        form='formEditProductOrder'
                        size='xs'
                        type='submit'
                        color='blue.6'
                        disabled={productOrderForm.isDirty(`productorder_set.${index}`) || productOrderForm.isDirty(`productorder_set.${index}.deliveryschedule_set`) ? false : true}
                        leftIcon={<IconDownload />} >
                        Save Changes</Button>

                    <Button
                        size='xs'
                        color='red.6'
                        radius='md'
                        disabled={!editAccess ? editAccess : true}

                        onClick={() => openModalDeletePo(po.id, index)}

                        leftIcon={<IconTrashX />} >
                        Delete</Button>

                </Button.Group>

                <NativeSelect
                    pt='lg'
                    label="Product Name"
                    placeholder="Please select product to order"
                    data={products.map(product => ({ value: product.id, label: product.name }))}
                    {...productOrderForm.getInputProps(`productorder_set.${index}.product`)}
                    icon={<IconPencil />}
                    disabled={!editAccess ? true : editAccess !== index + 1 ? true : productOrderForm.values.productorder_set[index].id !== ''}
                    required
                />

                <TextInput
                    label="Product Code"
                    placeholder=""
                    value={
                        productOrderForm.values.productorder_set[index].product !== '' ?
                            products.find(product => product.id === parseInt(productOrderForm.values.productorder_set[index].product)).code
                            : ''
                    }

                    readOnly
                    icon={<IconCodeAsterix />}
                    required
                />

                <NumberInput
                    {...productOrderForm.getInputProps(`productorder_set.${index}.ordered`)}
                    label='Ordered'
                    readOnly={!editAccess ? true : editAccess !== index + 1}
                    hideControls
                    required
                />
                <NumberInput
                    {...productOrderForm.getInputProps(`productorder_set.${index}.delivered`)}
                    label='Delivered'
                    readOnly
                    hideControls
                />

                <Tooltip label='Click to see schedule section' transition="slide-up" transitionDuration={300} withArrow >

                    <ActionIcon variant="outline" radius='lg'
                        onClick={() => setOpened((prev) => [...prev, index + 1])}
                        mt='xs'
                        mb='xl'
                        color='blue'
                    >
                        {open.includes(index + 1) ? <IconCaretRight size={16} /> : <IconCaretDown size={16} />}
                    </ActionIcon>
                </Tooltip>



                <Collapse
                    in={open.includes(index + 1)}
                    key={index + 1}
                    mt='xs'
                    mb='xl'
                >

                    <Group position="right" >
                        <CloseButton title="Close schedule section" variant="outline" radius='xl' size="xl" onClick={() => setOpened((prev) => prev.filter(item => item !== index + 1))} iconSize={20} />
                    </Group>

                    {productOrderForm.values.productorder_set[index].deliveryschedule_set.map((schedule, i) =>
                    (

                        <Group position="left" spacing='xs' key={i} >
                            <NumberInput icon={<IconSum />}
                                m='xs'
                                radius='md'
                                label='Quantity'
                                {...productOrderForm.getInputProps(`productorder_set.${index}.deliveryschedule_set.${i}.quantity`)}
                                readOnly={!editAccess ? !editAccess : editAccess !== index + 1}
                                hideControls
                                required
                            />
                            <DatePicker
                                icon={<IconCalendarEvent />}
                                disabled={!editAccess ? !editAccess : editAccess !== index + 1}
                                label='Schedule date'
                                {...productOrderForm.getInputProps(`productorder_set.${index}.deliveryschedule_set.${i}.date`)}
                                clearable={false}
                                required={true}
                            />

                            <ActionIcon
                                mt='lg'
                                style={{ display: !editAccess ? 'none' : editAccess !== index + 1 && 'none' }}
                                color="red"
                                onClick={() => {

                                    productOrderForm.removeListItem(`productorder_set.${index}.deliveryschedule_set`, i)
                                    const dirtyProductOrderForm = `productorder_set.${index}.deliveryschedule_set`
                                    productOrderForm.setDirty({ [dirtyProductOrderForm]: true })
                                }
                                }
                            >

                                <IconTrash />

                            </ActionIcon>

                        </Group>
                    )

                    )}

                    <Button
                        radius='md'
                        style={{ display: !editAccess ? 'none' : editAccess !== index + 1 && 'none' }}
                        leftIcon={<IconCalendarPlus />}
                        onClick={() =>
                            productOrderForm.insertListItem(`productorder_set.${index}.deliveryschedule_set`, { quantity: '', date: '' })
                        }
                    >
                        Add schedule
                    </Button>


                </Collapse>
            </div>
        ))
    }, [productOrderForm, editAccess, openButtonPo, productOrder, openModalDeletePo, products, open])


    return (
        <>
            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />
            <Loading />
            <section id='sales-order' ref={sectionRefs[0]} className={classes.section} >

                <Title className={classes.title}>
                    <a href="#sales-order" className={classes.a_href} >
                        Detail sales order
                    </a>
                </Title>
                <p>
                    This page contains every detail of sales order, all <Mark radius='md' color='teal'><a style={{ color: 'black' }} href='#product-order' >ordered products</a></Mark> and also <Mark radius='md' color='teal'><a style={{ color: 'black' }} href='#delivery-note' >delivery notes</a></Mark> related to this sales order
                </p>
                <p>
                    Note : Sales order cannot be deleted if there is a product order or product delivery
                </p>


                <Group position="right" >
                    <Button.Group>

                        <Button
                            size='xs'
                            radius='md'
                            color={openButtonSo.color}
                            onClick={
                                (event) => {
                                    handleClickEditButton()
                                    if (form.isDirty()) {
                                        form.reset()
                                        form.setValues(salesOrder)
                                    }
                                }}
                            leftIcon={disableEditSo ? <IconEdit /> : <IconX />}
                        >
                            {openButtonSo.label}
                        </Button>

                        <Button
                            form='formEditSo'
                            size='xs'
                            color='blue.6'
                            type='submit'
                            disabled={form.isDirty() ? disableEditSo : disableEditSo ? disableEditSo : !disableEditSo}
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red.6'
                            disabled={!disableEditSo}
                            radius='md'
                            onClick={openModalDeleteSo}
                            leftIcon={<IconTrashX />} >
                            Delete</Button>
                    </Button.Group>
                </Group>


                <form onSubmit={form.onSubmit(handleEditSo)} id='formEditSo'  >

                    <Stack spacing='xs' >

                        <TextInput
                            icon={<IconUser />}
                            label='Customer'
                            readOnly
                            {...form.getInputProps('customerName')}
                        />

                        <TextInput
                            icon={<IconCodeAsterix />}
                            label='Sales Order Code'
                            readOnly={disableEditSo}
                            {...form.getInputProps('code')}
                        />

                        <TextInput
                            readOnly
                            icon={<IconCalendarTime />}
                            label='Created at'
                            {...form.getInputProps('created')}
                        />

                        <DatePicker
                            label="Date"
                            {...form.getInputProps('date')}
                            disabled={disableEditSo}
                            clearable={false}
                            icon={<IconCalendar />}
                        />

                        <Group mt='md' >
                            <Checkbox.Group
                                label="Current status of sales order"
                                description="Set status to fixed for material requests and open access to production "
                                value={form.getInputProps('fixed').value ? ['fixed'] : ['pending']}

                            >

                                <Checkbox label='Fixed'
                                    value={'fixed'}
                                    radius='md'

                                />

                                <Checkbox label='Pending'
                                    value={'pending'}
                                    radius='md'

                                />

                            </Checkbox.Group>
                            <Button
                                radius='md'
                                leftIcon={form.values.fixed ? <IconClock2 /> : <IconCircleCheck />}
                                variant='outline'
                                mt='xl'
                                color={form.values.fixed ? 'red' : 'blue'}
                                onClick={openModalChangeStatus}
                            >{form.values.fixed ? 'Set to pending' : 'Set to fixed'}</Button>
                        </Group>

                        <Text size='sm' mt='md' >
                            Current progress
                        </Text>
                        <Progress
                            value={
                                form.getInputProps('presentage').value >= 100 ? 100 :
                                    form.getInputProps('presentage').value}

                            label={form.getInputProps('presentage').value >= 100 ? 'Finished 100%' :
                                `${form.getInputProps('presentage').value}%`}

                            size="xl" radius="xl" />

                    </Stack>


                </form>

            </section>


            <section id='product-order' ref={sectionRefs[1]} className={classes.section}>
                <Title className={classes.title}>
                    <a href="#product-order" className={classes.a_href} >
                        Ordered products
                    </a>
                </Title>

                <form onSubmit={productOrderForm.onSubmit(handleSubmitPo)} id='formEditProductOrder'  >

                    {contentProductOrder}

                </form>

                <Center>
                    <Button
                        radius='md'
                        leftIcon={<IconBarcode />}
                        mt='lg'
                        variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}
                        onClick={() => {
                            productOrderForm.insertListItem('productorder_set', {
                                sales_order: params.salesOrderId,
                                product: '',
                                ordered: '',
                                delivered: 0,
                                deliveryschedule_set: [
                                    {
                                        quantity: '',
                                        date: ''
                                    }
                                ],
                                done: false,
                                id: ''
                            })
                        }}
                    >
                        Add product order
                    </Button>
                </Center>

            </section>

            <section id='delivery-note' ref={sectionRefs[2]} className={classes.section} >
                <Title className={classes.title}>
                    <a href="#delivery-note" className={classes.a_href} >
                        Delivery notes
                    </a>
                </Title>

                <BaseTableExpanded
                    column={columnDeliveryNote}
                    data={Object.values(deliveryNote)}
                    expandComponent={ExpandedDeliveryNote}
                />


            </section>
        </>
    )

}


export default DetailSalesOrder

