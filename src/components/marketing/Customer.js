import React, { useState, useEffect, useMemo, useCallback } from "react";

import { useParams, Link, useNavigate } from "react-router-dom";
import { Text, Group, TextInput, Textarea, NumberInput, Button, Highlight, Collapse, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";

import { IconUser, IconDeviceMobile, IconMapPin, IconAt, IconEdit, IconX, IconDownload, IconTrashX, IconBrandProducthunt, IconFileCheck, IconClock, IconPlus, IconChevronDown, IconDotsCircleHorizontal } from "@tabler/icons";

import { SuccessNotif, FailedNotif } from "../notifications/Notifications";
import { sectionStyle } from "../../styles/sectionStyle";
import { useRequest } from "../../hooks/useRequest";
import BaseTableExpanded from "../tables/BaseTableExpanded";
import ExpandedSo from "../layout/ExpandedSo";
import ExpandedProduct from "../layout/ExpandedProduct";
import BreadCrumb from "../BreadCrumb";
import ExpandedDn from "../layout/ExpandedDn";
import { useSection } from "../../hooks/useSection";
import BaseAside from "../layout/BaseAside";

const Customer = () => {

    const { classes } = sectionStyle()
    const [action, setAction] = useState(0)
    const [dataCustomer, setDataCustomer] = useState({})
    const [buttonActive, setButtonActive] = useState('on_progress')
    const { customerId } = useParams()
    const navigate = useNavigate()
    const [notAllowed, setNotAllowed] = useState(true)
    const [editButton, setEditButton] = useState({ label: 'edit', color: 'blue.6' })
    const [on_progress_so, set_on_progress_so] = useState([])
    const [pendingSo, setPendingSo] = useState([])
    const [doneSo, setDoneSo] = useState([])
    const [product, setProduct] = useState([])
    const [deliveryNote, setDeliveryNote] = useState([])
    const [breadcrumb, setBreadCrumb] = useState([])
    const { Retrieve, Put, Delete, Loading } = useRequest()
    const { sectionRefs, activeSection } = useSection()

    const links = [
        {
            "label": "Detail Customer",
            "link": "#customer",
            "order": 1
        },
        {
            "label": "Sales Orders",
            "link": "#so",
            "order": 1
        },
        {
            "label": "Products",
            "link": "#product",
            "order": 1
        },
        {
            "label": "Delivery Note",
            "link": "#dn",
            "order": 1
        }
    ]


    const handleClickEditButton = useCallback(async () => {
        setEditButton((prev) => {
            if (prev.color === 'blue.6') {
                return { color: 'red.6', label: 'Cancel' }
            } else if (prev.color === 'red.6') {
                return { color: 'blue.6', label: 'Edit' }
            }

        })

        setNotAllowed((t) => !t)
    }, [])


    const handleSubmit = useCallback(async (data) => {
        // handle edit customer
        try {
            await Put(customerId, data, 'customer')
            SuccessNotif('Edit customer success')
            handleClickEditButton()
            setAction(prev => prev + 1)
        } catch (e) {
            FailedNotif('Edit customer failed')
            form.setErrors({ ...e.message.data })
        }
    }, [handleClickEditButton, Put, customerId])

    const handleDeleteCustomer = useCallback(async () => {
        try {
            await Delete(customerId, 'customer')
            SuccessNotif('Delete customer success')
            navigate('/home/marketing/customers')
        } catch (e) {
            FailedNotif(e.message.data[0])
        }
    }, [Delete, customerId, navigate])

    const openModal = useCallback(() => openConfirmModal({
        title: `Delete Customer ${dataCustomer.name} `,
        children: (
            <Text size="sm">
                Deleted data cannot be recovered.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteCustomer(),
    }), [handleDeleteCustomer, dataCustomer.name])


    const form = useForm(
        {
            initialValues: {
                name: '',
                email: '',
                phone: '',
                address: '',
            }
        })

    const setDataDeliveryNote = useCallback((deliverynotes) => {

        return deliverynotes.map(deliverynote => {
            return ({
                ...deliverynote, detailDeliveryNoteButton: <Button
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md'
                    component={Link}
                    to={`/home/marketing/delivery-note/${deliverynote.id}`}
                >
                    Detail
                </Button>
            })
        })

    }, [])

    const setDataProduct = useCallback((products) => {
        return products.map((product) => {
            return ({
                ...product, detailProductButton: <Button
                    component={Link}
                    to={`/home/marketing/customers/${customerId}/${product.id}`}
                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md' >
                    Detail
                </Button>

            })
        })
    }, [customerId])

    const setBreadcrumbAfterEffect = useCallback((name) => {
        setBreadCrumb([
            {
                path: '/home/marketing',
                label: 'Marketing'
            },
            {
                path: '/home/marketing/customers',
                label: 'Customers'
            },
            {
                path: `/home/marketing/customers/${customerId}`,
                label: { name }
            }
        ])
    }, [customerId])

    const setSoListAfterEffect = useCallback((salesorders) => {

        let on_progress = []
        let pending = []
        let done = []

        for (const so of salesorders) {
            so['detailSalesOrderButton'] = <Button

                leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                color='teal.8'
                variant='subtle'
                radius='md'
                component={Link}
                to={`/home/marketing/sales-order/${so.id}`}
            >
                Detail
            </Button>
            so['amountOfProduct'] = so.productorder_set.length
            if (so.done === true) {
                done = [...done, so]
            } else {
                if (so.fixed === true) {
                    on_progress = [...on_progress, so]
                } else {
                    pending = [...pending, so]
                }
            }
        }
        setDoneSo(done)
        set_on_progress_so(on_progress)
        setPendingSo(pending)
    }, [])



    const fetch = useCallback(async () => {

        try {
            const customer = await Retrieve(customerId, 'customer-detail')
            const salesorders = customer.marketing_salesorder_related
            const products = customer.ppic_product_related
            const deliverynotes = customer.ppic_deliverynotecustomer_related


            const deliveryNoteList = setDataDeliveryNote(deliverynotes)
            const productList = setDataProduct(products)

            setSoListAfterEffect(salesorders)
            setBreadcrumbAfterEffect(customer.name)
            setDataCustomer(customer)
            form.setValues(customer)
            setProduct(productList)
            setDeliveryNote(deliveryNoteList)

        } catch (e) {

        }
    }, [setSoListAfterEffect, setBreadcrumbAfterEffect, setDataDeliveryNote, setDataProduct, Retrieve, customerId])

    useEffect(() => {
        fetch()
    }, [fetch, action])

    const columnSo = useMemo(() => [
        // columns for sales order tables
        {
            name: 'Code',
            selector: row => row.code,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true
        },
        {
            name: 'Amount of product',
            selector: row => row.amountOfProduct,

        },
        {
            name: '',
            selector: row => row.detailSalesOrderButton,
            style: {
                padding: 0,
            }
        }

    ], [])



    const columnProduct = useMemo(() => [
        // columns for product tables
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Code',
            selector: row => row.code,
        },
        {
            name: 'Process',
            selector: row => row.process,

        },
        {
            name: 'Type',
            selector: row => row.type.name,
        },
        {
            name: '',
            selector: row => row.detailProductButton,
            style: {
                padding: 0,
            }
        }

    ], [])

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
            selector: row => row.detailDeliveryNoteButton,
            style: {
                padding: 0,
            }
        }

    ], [])


    return (
        <>

            <BaseAside links={links} activeSection={activeSection} />
            <Loading />
            <BreadCrumb links={breadcrumb} />

            <section id='customer' ref={sectionRefs[0]} className={classes.section} >

                <Title className={classes.title}>
                    <a href="#customer" className={classes.a_href} >
                        Detail Customer
                    </a>
                </Title>

                <Highlight
                    align="left"
                    highlight={['sales order', 'delivery']}
                    highlightStyles={(theme) => ({
                        backgroundImage: theme.fn.linearGradient(45, theme.colors.dark[5], theme.colors.gray[9]),
                        fontWeight: 800,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: 16
                    })}
                >

                    Customer who have sales order or delivery data cannot be deleted

                </Highlight>

                <Group position="right" >
                    <Button.Group>

                        <Button
                            size='xs'
                            color={editButton.color}
                            onClick={
                                (event) => {
                                    handleClickEditButton()
                                    if (form.isDirty()) {
                                        form.reset()
                                        form.setValues({ ...dataCustomer })
                                    }
                                }}
                            radius='md'
                            leftIcon={notAllowed === true ? <IconEdit /> : <IconX />}
                        >
                            {editButton.label}
                        </Button>

                        <Button
                            type="submit"
                            form='formEdit'
                            size='xs'
                            disabled={form.isDirty() ? notAllowed : notAllowed ? notAllowed : !notAllowed}
                            color='blue.6'
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red.6'
                            disabled={!notAllowed}
                            radius='md'
                            onClick={openModal}
                            leftIcon={<IconTrashX />} >
                            Delete</Button>
                    </Button.Group>
                </Group>

                <form onSubmit={form.onSubmit(handleSubmit)} id='formEdit' >
                    <TextInput
                        icon={<IconUser />}
                        m='xs'
                        radius='md'
                        label='Name'
                        readOnly={notAllowed}
                        {...form.getInputProps('name')}
                        variant='filled'

                    />

                    <TextInput
                        icon={<IconAt />}
                        m='xs'
                        radius='md'
                        label='Email'
                        readOnly={notAllowed}
                        {...form.getInputProps('email')}
                        required
                    />

                    <NumberInput
                        icon={<IconDeviceMobile />}
                        m='xs' radius='md'
                        label='Phone'
                        readOnly={notAllowed}
                        {...form.getInputProps('phone')}
                        required
                        hideControls
                    />

                    <Textarea
                        icon={<IconMapPin />}
                        m='xs'
                        radius='md'
                        label='Address'
                        readOnly={notAllowed}
                        {...form.getInputProps('address')}
                        required
                    />
                </form>
            </section>

            <section id='so' className={classes.section} ref={sectionRefs[1]}  >

                <Title className={classes.title} >
                    <a href="#so" className={classes.a_href} >Sales Order</a>
                </Title>

                <Group position="apart" >


                    <Button.Group>
                        <Button
                            variant='light'
                            leftIcon={<IconBrandProducthunt />}
                            radius='md'
                            className={buttonActive === 'on_progress' && classes.buttonBlueActive}
                            rightIcon={buttonActive === 'on_progress' && <IconChevronDown />}
                            onClick={(e) => setButtonActive('on_progress')}
                        >
                            On Progress
                        </Button>

                        <Button
                            variant='light'
                            onClick={(e) => setButtonActive('pending')}
                            color='orange'
                            className={buttonActive === 'pending' && classes.buttonOrangeActive}
                            rightIcon={buttonActive === 'pending' && <IconChevronDown />}
                            leftIcon={<IconClock />}
                        >
                            Pending
                        </Button>

                        <Button
                            variant='light'
                            color='green'
                            leftIcon={<IconFileCheck />}
                            className={buttonActive === 'done' && classes.buttonGreenActive}
                            rightIcon={buttonActive === 'done' && <IconChevronDown />}
                            radius='md'
                            onClick={(e) => setButtonActive('done')}
                        >
                            Done
                        </Button>
                    </Button.Group>

                    <Button
                        radius='md'
                        leftIcon={<IconPlus />}
                        variant='outline'
                        component={Link}
                        to='/home/marketing/sales-order/new'
                    >
                        New Sales order
                    </Button>
                </Group>

                <Collapse
                    in={buttonActive === 'on_progress'}
                    transitionDuration={500}
                >

                    <BaseTableExpanded
                        column={columnSo}
                        data={on_progress_so}
                        expandComponent={ExpandedSo}
                    />

                </Collapse>

                <Collapse
                    in={buttonActive === 'pending'}
                    transitionDuration={500}
                >
                    <BaseTableExpanded
                        column={columnSo}
                        data={pendingSo}
                        expandComponent={ExpandedSo}
                    />

                </Collapse>
                <Collapse
                    in={buttonActive === 'done'}
                    transitionDuration={500}
                >
                    <BaseTableExpanded
                        column={columnSo}
                        data={doneSo}
                        expandComponent={ExpandedSo}
                    />

                </Collapse>

            </section>


            <section id='product' ref={sectionRefs[2]} className={classes.section}>

                <Title className={classes.title} >
                    <a href="#product" className={classes.a_href} >Product</a>
                </Title>


                <BaseTableExpanded
                    column={columnProduct}
                    data={product}
                    expandComponent={ExpandedProduct}
                />


            </section>

            <section id='dn' ref={sectionRefs[3]} className={classes.section} >

                <Title className={classes.title} >
                    <a href="#dn" className={classes.a_href} >Delivery Note</a>
                </Title>

                <BaseTableExpanded
                    column={columnDeliveryNote}
                    data={deliveryNote}
                    expandComponent={ExpandedDn}
                />

            </section>

        </>
    )
}


export default Customer



