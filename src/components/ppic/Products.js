import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { AuthContext } from '../../context/AuthContext'
import BaseTable from '../tables/BaseTable'
import { useRequest } from "../../hooks/useRequest";
import { Link } from "react-router-dom";
import { Button, Group, Paper, TextInput, Title, Text } from "@mantine/core";
import { IconDotsCircleHorizontal, IconSearch, IconPlus, IconEdit, IconTrash } from "@tabler/icons";
import BreadCrumb from '../BreadCrumb'
import BaseTableDefaultExpanded from '../tables/BaseTableDefaultExpanded'
import { sectionStyle } from "../../styles/sectionStyle";
import useScrollSpy from 'react-use-scrollspy'
import BaseAside from "../layout/BaseAside";
import { FailedNotif, SuccessNotif } from "../notifications/Notifications";
import { openConfirmModal, closeAllModals, openModal } from "@mantine/modals";



const ExpandedProduct = ({ data }) => {

    const products = data.ppic_product_related.map(product => ({
        ...product, button: <Button
            leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
            color='teal.8'
            variant='subtle'
            radius='md'
            component={Link}
            to={`${product.id}`}
        >
            Detail
        </Button>
    }))

    const productColumn = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Product number',
            selector: row => row.code,
        },
        {
            name: 'Product type',
            selector: row => row.type.name,

        },
        {
            name: '',
            selector: row => row.button,
            style: {
                padding: 0,
            }
        }
    ], [])


    return (
        <>
            <Paper ml='lg' mb='md' >
                <BaseTable
                    column={productColumn}
                    data={products}
                    pagination={false}
                />

            </Paper>

        </>
    )
}

const AddProductType = ({ setaction }) => {

    const { Post } = useRequest()
    const auth = useContext(AuthContext)
    const [name, setName] = useState('')

    const handleSubmit = async () => {
        try {
            await Post({ name: name }, auth.user.token, 'product-type')
            setaction(prev => prev + 1)
            closeAllModals()
            SuccessNotif('Add product type success')
        } catch (e) {
            FailedNotif('Add product type failed')
            console.log(e)
        }
    }

    const openConfirmSubmit = () => openConfirmModal({
        title: `Add product type`,
        children: (
            <Text size="sm">
                Are you sure?, data will be saved.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit()
    })


    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault()
                openConfirmSubmit()
            }}  >

                <TextInput
                    radius='md'
                    value={name}
                    required
                    label='Type name'
                    placeholder="Input name of new type"
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <Button
                    my='md'
                    radius='md'
                    fullWidth
                    type="submit"
                >
                    Save
                </Button>

            </form>
        </>
    )
}

const AddProcessType = ({ setaction }) => {

    const { Post } = useRequest()
    const auth = useContext(AuthContext)
    const [name, setName] = useState('')

    const handleSubmit = async () => {
        try {
            await Post({ name: name }, auth.user.token, 'process-type')
            closeAllModals()
            setaction(prev => prev + 1)
            SuccessNotif('Add process type success')
        } catch (e) {
            console.log(e)
            FailedNotif('Add process type failed')
        }
    }


    const openConfirmSubmit = () => openConfirmModal({
        title: `Add process type`,
        children: (
            <Text size="sm">
                Are you sure?, data will be saved.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit()
    })


    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault()
                openConfirmSubmit()
            }}  >

                <TextInput
                    radius='md'
                    value={name}
                    required
                    label='Type name'
                    placeholder="Input name of new type"
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <Button
                    my='md'
                    radius='md'
                    type="submit"
                    fullWidth
                >
                    Save
                </Button>
            </form>
        </>
    )
}

const EditProductType = ({ setaction, data }) => {

    const [name, setName] = useState('')
    const auth = useContext(AuthContext)
    const { Put } = useRequest()

    useEffect(() => {
        setName(data.name)
    }, [data])


    const handleSubmit = async () => {
        try {
            await Put(data.id, { name: name }, auth.user.token, 'product-type')
            closeAllModals()
            setaction(prev => prev + 1)
            SuccessNotif('Edit product type success')
        } catch (e) {
            console.log(e)
            FailedNotif('Edit product type failed')
        }
    }


    const openConfirmSubmit = () => openConfirmModal({
        title: `Edit product type`,
        children: (
            <Text size="sm">
                Are you sure?, data will be saved.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit()
    })

    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault()
                openConfirmSubmit()
            }}  >

                <TextInput
                    radius='md'
                    label='Type'
                    required
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <Button
                    my='md'
                    radius='md'
                    type="submit"
                    fullWidth
                    disabled={data.name === name}
                >
                    Save
                </Button>

            </form>
        </>
    )
}

const EditProcessType = ({ setaction, data }) => {

    const [name, setName] = useState('')
    const auth = useContext(AuthContext)
    const { Put } = useRequest()

    useEffect(() => {
        setName(data.name)
    }, [data])


    const handleSubmit = async () => {
        try {
            await Put(data.id, { name: name }, auth.user.token, 'process-type')
            closeAllModals()
            setaction(prev => prev + 1)
            SuccessNotif('Edit process type success')
        } catch (e) {
            console.log(e)
            FailedNotif('Edit process type failed')
        }
    }


    const openConfirmSubmit = () => openConfirmModal({
        title: `Edit process type`,
        children: (
            <Text size="sm">
                Are you sure?, data will be saved.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleSubmit()
    })

    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault()
                openConfirmSubmit()
            }}  >

                <TextInput
                    radius='md'
                    label='Type'
                    required
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <Button
                    my='md'
                    radius='md'
                    fullWidth
                    type="submit"
                    disabled={data.name === name}
                >
                    Save
                </Button>
            </form>
        </>
    )

}


export default function Product() {

    const [productCustomer, setProductCustomer] = useState([])
    const auth = useContext(AuthContext)
    const { Get, Delete } = useRequest()
    const [searchVal, setSearchVal] = useState('')
    const { classes } = sectionStyle()

    const [processType, setProcessType] = useState([])
    const [productType, setProductType] = useState([])
    const [actionProcessType, setActionProcessType] = useState(0)
    const [actionProductType, setActionProductType] = useState(0)

    const filteredProductCustomer = useMemo(() => {
        const valFiltered = searchVal.toLowerCase()

        return productCustomer.reduce((prev, current) => {
            const products = current.ppic_product_related.filter(product => product.code.toLowerCase().includes(valFiltered) || product.name.toLowerCase().includes(valFiltered))

            if (valFiltered === '') {
                return [...prev, current]
            }

            if (products.length !== 0) {
                return [...prev, { ...current, ppic_product_related: products }]
            } else {
                return prev
            }

        }, [])
    }, [searchVal, productCustomer])

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

    const links = [
        {
            "label": "Products",
            "link": "#product",
            "order": 1
        },
        {
            "label": 'Product type',
            "link": '#product-type',
            'order': 1
        },
        {
            "label": 'Process type',
            "link": '#process-type',
            'order': 1
        },
    ]

    const breadcrumb = [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/product',
            label: 'Product'
        }
    ]

    const columnProductCustomer = useMemo(() => [

        {
            name: 'Customer name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Amount of product',
            selector: row => row.ppic_product_related.length,
        }

    ], [])


    const columnProductType = useMemo(() => [
        {
            name: 'Type',
            selector: row => row.name
        },
        {
            name: 'Amount of product',
            selector: row => row.products
        },
        {
            name: '',
            selector: row => row.buttonEdit
        },
        {
            name: '',
            selector: row => row.buttonDelete
        }
    ], [])

    const columnProcessType = useMemo(() => [
        {
            name: 'Type',
            selector: row => row.name
        },
        {
            name: 'Amount of process',
            selector: row => row.amount_of_process
        },
        {
            name: '',
            selector: row => row.buttonEdit
        },
        {
            name: '',
            selector: row => row.buttonDelete
        }

    ], [])


    const openAddProductType = () => openModal({
        title: `Add product type`,
        radius: 'md',
        children: <AddProductType setaction={setActionProductType} />,
    });

    const openAddProcessType = () => openModal({
        title: `Add process type`,
        radius: 'md',
        children: <AddProcessType setaction={setActionProcessType} />,
    });

    const openEditProcessType = (data) => openModal({
        title: `Edit process type`,
        radius: 'md',
        children: <EditProcessType data={data} setaction={setActionProcessType} />
    })

    const openEditProductType = (data) => openModal({
        title: `Edit product type`,
        radius: 'md',
        children: <EditProductType data={data} setaction={setActionProcessType} />
    })


    const openDeleteProductTypeModal = (id) => openConfirmModal({
        title: 'Delete product type',
        children: (
            <Text size="sm">
                Are you sure?, this product type will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteProductType(id)
    })

    const openDeleteProcessTypeModal = (id) => openConfirmModal({
        title: 'Delete process type',
        children: (
            <Text size="sm">
                Are you sure?, this process type will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteProcessType(id)
    })

    const handleDeleteProductType = async (id) => {
        try {
            await Delete(id, auth.user.token, 'product-type')
            setActionProductType(prev => prev + 1)
            SuccessNotif('Delete product type success')
        } catch (e) {
            console.log(e)
            FailedNotif('Delete product type failed')
            FailedNotif(e.message.data)
        }
    }

    const handleDeleteProcessType = async (id) => {
        try {
            await Delete(id, auth.user.token, 'process-type')
            setActionProcessType(prev => prev + 1)
            SuccessNotif('Delete process type success')
        } catch (e) {
            console.log(e)
            FailedNotif('Delete process type failed')
            FailedNotif(e.message.data)
        }
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                const productCustomer = await Get(auth.user.token, 'product-list')
                setProductCustomer(productCustomer)

            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [auth.user.token])

    useEffect(() => {
        // effect for product type

        const fetchProductType = async () => {
            try {
                const product_type = await Get(auth.user.token, 'product-type')
                const types = product_type.map(type => ({
                    ...type, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='teal.8'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditProductType(type)}
                        >
                            Edit
                        </Button>,
                    buttonDelete: <Button
                        leftIcon={<IconTrash stroke={2} size={16} />}
                        color='red'
                        variant='subtle'
                        radius='md'
                        onClick={() => openDeleteProductTypeModal(type.id)}
                    >
                        Delete
                    </Button>
                }))

                setProductType(types)
            } catch (e) {
                console.log(e)
            }
        }

        fetchProductType()

    }, [auth.user.token, actionProductType])


    useEffect(() => {
        // effect for process type

        const fetchProcessType = async () => {
            try {
                const process_type = await Get(auth.user.token, 'process-type')
                const types = process_type.map(type => ({
                    ...type, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='teal.8'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditProcessType(type)}
                        >
                            Edit
                        </Button>,
                    buttonDelete: <Button
                        leftIcon={<IconTrash stroke={2} size={16} />}
                        color='red'
                        variant='subtle'
                        radius='md'
                        onClick={() => openDeleteProcessTypeModal(type.id)}
                    >
                        Delete
                    </Button>
                }))

                setProcessType(types)
            } catch (e) {
                console.log(e)
            }
        }

        fetchProcessType()

    }, [auth.user.token, actionProcessType])



    return (
        <>
            <BreadCrumb links={breadcrumb} />
            <BaseAside links={links} activeSection={activeSection} />

            <section id='product' className={classes.section} ref={sectionRefs[0]}  >

                <Title className={classes.title} >
                    <a href="#product" className={classes.a_href} >
                        Products
                    </a>
                </Title>


                <Group position="right" >
                    <TextInput
                        icon={<IconSearch />}
                        placeholder='Search product'
                        radius='md'
                        value={searchVal}
                        onChange={e => setSearchVal(e.target.value)}
                    />
                    <Button
                        variant='outline'
                        style={{ float: 'right' }}
                        radius='md'
                        leftIcon={<IconPlus />}
                        component={Link}
                        to='new'
                    >
                        Add product
                    </Button>

                </Group>

                <BaseTableDefaultExpanded

                    column={columnProductCustomer}
                    data={filteredProductCustomer}
                    expandComponent={ExpandedProduct}
                    pagination={false}
                    condition={row => row.ppic_product_related.length !== 0}
                />
            </section>

            <section id='product-type' className={classes.section} ref={sectionRefs[1]}  >
                <Title className={classes.title} >
                    <a href="#product-type" className={classes.a_href} >
                        Product type
                    </a>
                </Title>


                <Group position="right" >
                    <Button
                        leftIcon={<IconPlus />}
                        radius='md'
                        variant='outline'
                        onClick={openAddProductType}
                    >
                        Product type
                    </Button>
                </Group>

                <BaseTable
                    column={columnProductType}
                    data={productType}

                />

            </section>

            <section id='process-type' className={classes.section} ref={sectionRefs[2]}  >
                <Title className={classes.title} >
                    <a href="#process-type" className={classes.a_href} >
                        Process type
                    </a>
                </Title>

                <Group position="right" >
                    <Button
                        leftIcon={<IconPlus />}
                        radius='md'
                        variant='outline'
                        onClick={openAddProcessType}
                    >
                        Process type
                    </Button>
                </Group>

                <BaseTable
                    column={columnProcessType}
                    data={processType}

                />


            </section>

        </>
    )

}


