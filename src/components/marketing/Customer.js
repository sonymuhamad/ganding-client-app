import React, { useRef, useState, useEffect, useContext, useMemo } from "react";

import { useParams, Link, useLocation, useNavigate } from "react-router-dom";

import { Aside, Text, MediaQuery, Box, Group, Modal, List, TextInput, Textarea, NumberInput, Button, LoadingOverlay, Loader, Collapse } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useScrollLock } from "@mantine/hooks";
import { openConfirmModal } from "@mantine/modals";

import { IconListSearch, IconUser, IconDeviceMobile, IconMapPin, IconAt, IconEdit, IconX, IconDownload, IconTrashX, IconBrandProducthunt, IconFileCheck, IconClock, IconPlus, IconChevronDown, IconDotsCircleHorizontal } from "@tabler/icons";

import useScrollSpy from 'react-use-scrollspy'

import DataTable from "react-data-table-component";

import { SuccessNotif, FailedNotif } from "../notifications/Notifications";
import { AuthContext } from "../../context/AuthContext";
import { customerPageStyle } from "../../styles/customerPageStyle";
import { Retrieve, Put, Delete } from "../../services/Request";
import ExpandedSo from "../layout/ExpandedSo";
import { customTableStyle } from "../../services/External";


const Customer = () => {

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

    const { classes, cx } = customerPageStyle()

    let i = -1
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

    const items = links.map((item) => {
        { i = i + 1 }
        return (
            <Box
                component={'a'}
                href={item.link}

                key={item.label}
                className={cx(classes.link, { [classes.linkActive]: activeSection === i })}
                sx={(theme) => ({ paddingLeft: item.order * theme.spacing.md })}
            >
                {item.label}
            </Box>
        )
    }
    );

    const [dataCustomer, setDataCustomer] = useState({})
    const [buttonActive, setButtonActive] = useState('on_progress')
    const { customerId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    const [notAllowed, setNotAllowed] = useState(true)
    const [editButton, setEditButton] = useState({ label: 'edit', color: 'blue' })
    const [scrollLocked, setScrollLocked] = useScrollLock()
    const [visible, setVisible] = useState(false)
    const [on_progress_so, set_on_progress_so] = useState([])
    const [pendingSo, setPendingSo] = useState([])
    const [doneSo, setDoneSo] = useState([])
    const [product, setProduct] = useState([])
    const [deliveryNote, setDeliveryNote] = useState([])



    const openModal = () => openConfirmModal({
        title: `Delete Customer ${dataCustomer.name} `,
        children: (
            <Text size="sm">
                Deleted data cannot be recovered.
            </Text>
        ),
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => handleDeleteCustomer(),
    });

    const icons = [<IconUser />, <IconAt />, <IconDeviceMobile />, <IconMapPin />]
    const form = useForm(
        {
            initialValues: {
                name: '',
                email: '',
                phone: '',
                address: '',
            }
        })

    const handleClickEditButton = async () => {
        setEditButton((prev) => {
            if (prev.color === 'blue') {
                return { color: 'red', label: 'Cancel' }
            } else if (prev.color === 'red') {
                return { color: 'blue', label: 'Edit' }
            }

        })

        setScrollLocked((l) => !l)
        setNotAllowed((t) => !t)
    }

    const fetch = async () => {

        try {
            const customer = await Retrieve(customerId, auth.user.token, 'customer-detail')
            console.log(customer)
            const salesorders = customer.marketing_salesorder_related
            let products = customer.ppic_product_related
            let deliverynotes = customer.ppic_deliverynotecustomer_related

            let on_progress = []
            let pending = []
            let done = []

            deliverynotes = deliverynotes.map(deliverynote => {
                return ({
                    ...deliverynote, detailDeliveryNoteButton: <Button
                        leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                        color='teal.8'
                        variant='subtle'
                        radius='md' >
                        Detail
                    </Button>
                })
            })

            products = products.map((product) => {
                return ({
                    ...product, detailProductButton: <Button
                        leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                        color='teal.8'
                        variant='subtle'
                        radius='md' >
                        Detail
                    </Button>

                })
            })

            for (const so of salesorders) {
                so['detailSalesOrderButton'] = <Button

                    leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
                    color='teal.8'
                    variant='subtle'
                    radius='md' >
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

            set_on_progress_so(on_progress)
            setDoneSo(done)
            setPendingSo(pending)
            setDataCustomer({ ...customer })
            form.setValues({ ...customer })
            setProduct(products)
            setDeliveryNote(deliverynotes)
        } catch (e) {
            if (e.message.status === 401) {
                auth.resetToken(auth.user.token, location.pathname)
                // expired token handle
            }

        }
    }

    useEffect(() => {
        fetch()
    }, [])

    // console.log(on_progress_so, 'on progress so')
    // console.log(pendingSo, 'pendingso')
    // console.log(doneSo, 'doneso')

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

    const handleSubmit = async (data) => {
        setVisible((v) => !v)
        try {
            await Put(customerId, data, auth.user.token, 'customer')
            await fetch()
            await handleClickEditButton()
        } catch (e) {
            form.setErrors({ ...e.message.data })
            if (e.message.status === 401) {
                auth.resetToken(auth.user.token, location.pathname)
                // expired token handle
            }

        } finally {
            setVisible((v) => !v)
        }
    }

    const handleDeleteCustomer = async () => {
        setVisible((v) => !v)
        try {
            await Delete(customerId, auth.user.token, 'customer')
            SuccessNotif('Delete customer success')
            navigate('/home/marketing/customers')
        } catch (e) {
            FailedNotif(e.message.data[0])
        } finally {
            setVisible((v) => !v)
        }
    }

    return (
        <>
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Aside p="md" hiddenBreakpoint="sm" hidden width={{ sm: 200, lg: 300 }}>
                    <div>
                        <Group mb="md">
                            <IconListSearch size={18} stroke={1.5} />
                            <Text>Table of contents</Text>
                        </Group>
                        {items}
                    </div>
                </Aside>
            </MediaQuery>




            <LoadingOverlay visible={visible} overlayBlur={2} />
            <section id='customer' ref={sectionRefs[0]} style={{ paddingTop: 50, marginTop: -75, marginBottom: 75 }} >
                <h1 style={{ color: 'black' }} >

                    <a href="#customer" style={{ color: 'black' }} >Detail Customer</a>
                </h1>
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
                            color='blue'
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red'
                            disabled={!notAllowed}
                            radius='md'
                            onClick={openModal}
                            leftIcon={<IconTrashX />} >
                            Delete</Button>
                    </Button.Group>
                </Group>

                <form onSubmit={form.onSubmit(handleSubmit)} id='formEdit' >
                    <TextInput
                        icon={<IconUser size={15} stroke={2} />}
                        m='xs'
                        radius='md'
                        label='Name'
                        readOnly={notAllowed}
                        {...form.getInputProps('name')}
                        variant='filled'

                    />

                    <TextInput
                        icon={<IconAt size={15} stroke={2} />}
                        m='xs'
                        radius='md'
                        label='Email'
                        readOnly={notAllowed}
                        {...form.getInputProps('email')}
                        required
                    />

                    <NumberInput
                        icon={<IconDeviceMobile size={15} stroke={2} />}
                        m='xs' radius='md'
                        label='Phone'
                        readOnly={notAllowed}
                        {...form.getInputProps('phone')}
                        required
                    />

                    <Textarea
                        icon={<IconMapPin size={20} stroke={2} />}
                        m='xs'
                        radius='md'
                        label='Address'
                        readOnly={notAllowed}
                        {...form.getInputProps('address')}
                        required
                    />
                </form>
            </section>

            <section id='so' style={{ paddingTop: 50, marginTop: -75, marginBottom: 75 }} ref={sectionRefs[1]}  >
                <h1 style={{ color: 'black' }} >

                    <a href="#so" style={{ color: 'black' }} >Sales Order</a>
                </h1>
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
                    >
                        New Sales order
                    </Button>
                </Group>

                <Collapse
                    in={buttonActive === 'on_progress'}
                    transitionDuration={500}
                >
                    <DataTable
                        customStyles={customTableStyle}
                        columns={columnSo}
                        data={on_progress_so}
                        expandableRows
                        expandableRowsComponent={ExpandedSo}
                        highlightOnHover={true}
                        pagination
                    />
                </Collapse>

                <Collapse
                    in={buttonActive === 'pending'}
                    transitionDuration={500}
                >
                    <DataTable
                        customStyles={customTableStyle}
                        columns={columnSo}
                        data={pendingSo}
                        expandableRows
                        expandableRowsComponent={ExpandedSo}
                        highlightOnHover={true}
                        pagination
                    />
                </Collapse>
                <Collapse
                    in={buttonActive === 'done'}
                    transitionDuration={500}
                >
                    <DataTable
                        customStyles={customTableStyle}
                        columns={columnSo}
                        data={doneSo}
                        expandableRows
                        expandableRowsComponent={ExpandedSo}
                        highlightOnHover={true}
                        pagination
                    />

                </Collapse>



            </section>


            <section id='product' ref={sectionRefs[2]} style={{ paddingTop: 50, marginTop: -75, marginBottom: 75 }}>
                <h1 style={{ color: 'black' }} >
                    <a href="#product" style={{ color: 'black' }} >Product</a>
                </h1>

                <DataTable
                    customStyles={customTableStyle}
                    columns={columnProduct}
                    data={product}
                    highlightOnHover={true}
                    pagination
                />

            </section>

            <section id='dn' ref={sectionRefs[3]} style={{ paddingTop: 50, marginTop: -75, marginBottom: 75 }} >
                <h1 style={{ color: 'black' }} >
                    <a href="#dn" style={{ color: 'black' }} >Delivery Note</a>
                </h1>

                <DataTable
                    customStyles={customTableStyle}
                    columns={columnDeliveryNote}
                    data={deliveryNote}
                    highlightOnHover={true}
                    pagination
                />

            </section>



        </>
    )
}


export default Customer



