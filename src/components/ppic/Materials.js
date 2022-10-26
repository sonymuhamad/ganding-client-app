import React, { useState, useEffect, useMemo, useContext, useRef } from "react";
import { Button, TextInput, Paper, Group, Title, Checkbox, NumberInput, Text, ActionIcon, NativeSelect, Divider, List } from "@mantine/core";

import { Link } from "react-router-dom";

import { IconSearch, IconPlus, IconDotsCircleHorizontal, IconTrash, IconEdit, IconDownload, IconSend } from "@tabler/icons";
import BaseAside from '../layout/BaseAside'
import { sectionStyle } from "../../styles/sectionStyle";
import useScrollSpy from 'react-use-scrollspy'

import { openModal, closeAllModals, openConfirmModal } from "@mantine/modals";

import { AuthContext } from "../../context/AuthContext";
import { useRequest } from "../../hooks/useRequest";
import BaseTableDefaultExpanded from "../tables/BaseTableDefaultExpanded";
import BaseTable from "../tables/BaseTable";
import BreadCrumb from "../BreadCrumb";
import BaseTableExpanded from "../tables/BaseTableExpanded";
import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from '../notifications/Notifications'

const ExpandedMaterial = ({ data }) => {

    const materials = data.ppic_material_related.map(material => ({
        ...material, button: <Button
            leftIcon={<IconDotsCircleHorizontal stroke={2} size={16} />}
            color='teal.8'
            variant='subtle'
            radius='md'
            component={Link}
            to={`${material.id}`}
        >
            Detail
        </Button>
    }))

    const productColumn = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Material spec',
            selector: row => row.spec,
        },
        {
            name: 'Material type',
            selector: row => row.uom.name,

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
                    data={materials}
                    pagination={false}
                />

            </Paper>

        </>
    )
}


const ExpandedMrpRecommendation = ({ data }) => {

    const columnDetailMrp = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.product.name,
            sortable: true
        },
        {
            name: 'Qty needed',
            selector: row => row.quantity
        },
        {
            name: 'Qty production',
            selector: row => row.quantity_production
        }
    ], [])

    return (
        <Paper ml='lg' mb='md' >
            <BaseTable
                column={columnDetailMrp}
                pagination={false}
                data={data.detailmrp_set}
            />
        </Paper>
    )
}

const MakeRequestMaterial = ({ mrp, setaction }) => {


    const [value, setValue] = useState(0)
    const { Post } = useRequest()
    const auth = useContext(AuthContext)

    useEffect(() => {
        setValue(mrp.quantity)
    }, [auth.user.token])

    const handleSubmit = async () => {
        const { detailmrp_set, material, ...rest } = mrp

        const data = {
            material: material.id,
            quantity: value,
            detailmrp_set: []
        }
        console.log(data.quantity)
        try {
            await Post(data, auth.user.token, 'mrp-management')
            SuccessNotif('Material request has been sent')
            closeAllModals()
            setaction(prev => prev + 1)
        } catch (e) {
            console.log(e)
            FailedNotif('Material request failed')
            closeAllModals()
        }

    }

    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}   >

                <NumberInput
                    label="Quantity"
                    value={value}
                    required
                    radius='md'
                    onChange={(value) => { setValue(value) }}
                    placeholder="Input quantity for request material"
                    hideControls
                />


                <Text size='sm' my='xs'  >
                    This material will be allocated to production of
                </Text>


                {mrp.detailmrp_set.map((eachDetail, index) => (
                    <List withPadding key={index} size='sm'  >
                        <List.Item>
                            {eachDetail.product.name}
                        </List.Item>
                    </List>

                ))}

                <Button
                    fullWidth
                    type="submit"
                    radius='md'
                    mt="md"
                >


                    Save
                </Button>
            </form>
        </>
    )
}

const PostMaterialRequest = ({ mrp = { id: '', material: { id: '', name: '' }, quantity: '', detailmrp_set: [] }, setaction }) => {

    const { Post, Get } = useRequest()
    const [productList, setProductList] = useState([])
    const [materialList, setMaterialList] = useState([])

    const auth = useContext(AuthContext)
    const dataDetailMrp = mrp.detailmrp_set.map(detail => ({ ...detail, product: detail.product.id }))

    const form = useForm({
        initialValues: {
            id: mrp.id,
            material: mrp.material.id,
            quantity: mrp.quantity,
            detailmrp_set: dataDetailMrp
        }
    })

    useEffect(() => {
        const fetch = async () => {
            try {
                const product = await Get(auth.user.token, 'product-lists')
                const material = await Get(auth.user.token, 'material-lists')

                setProductList(product)
                setMaterialList(material)
            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [])

    const handleSubmit = async (value) => {
        try {
            await Post(value, auth.user.token, 'mrp-management')
            SuccessNotif('Material request data change is successful')
            setaction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            console.log(e)
            FailedNotif('Failed to change material request data')
            FailedNotif(e.message.data.detailmrp_set)
        }
    }

    const detailmrp = form.values.detailmrp_set.map((mrp, index) => (
        <Paper p='xs' my='xs' radius='md' shadow='xs' key={index}  >
            <Group>

                <NativeSelect
                    label='product'
                    radius='md'
                    required
                    placeholder="Select product"
                    data={productList.map(product => ({ value: product.id, label: product.name }))}
                    {...form.getInputProps(`detailmrp_set.${index}.product`)}
                />
                <ActionIcon
                    color="red"
                    mt='lg'
                    onClick={() => {
                        form.removeListItem(`detailmrp_set`, index)
                    }}
                >
                    <IconTrash />
                </ActionIcon>
            </Group>
            <Group>

                <NumberInput
                    hideControls
                    label='Qty need'
                    radius='md'
                    required
                    placeholder="Qty material need for this product"
                    {...form.getInputProps(`detailmrp_set.${index}.quantity`)}
                />

                <NumberInput
                    label='qty production'
                    radius='md'
                    hideControls
                    required
                    placeholder="Qty production of this product"
                    {...form.getInputProps(`detailmrp_set.${index}.quantity_production`)}
                />
            </Group>
        </Paper>
    ))

    return (
        <>
            <form id='formRequestMaterial' onSubmit={form.onSubmit(handleSubmit)}  >

                <NativeSelect
                    label='Material'
                    placeholder="Select material"
                    data={materialList.map(material => ({ value: material.id, label: material.name }))}
                    radius='md'
                    required
                    {...form.getInputProps('material')}
                />

                <NumberInput
                    label='Quantity'
                    radius='md'
                    required
                    placeholder="input quantity"
                    {...form.getInputProps('quantity')}
                />
                <Divider mt="xl" mb='xs' variant='dashed' label="Production" />
                {detailmrp}

                <Button
                    radius='md'
                    leftIcon={<IconPlus />}
                    onClick={() => {
                        form.insertListItem(`detailmrp_set`, {
                            product: '',
                            quantity: '',
                            quantity_production: ''
                        })
                    }}
                >
                    Product
                </Button>

                <Button
                    radius='md'
                    my='md'
                    form="formRequestMaterial"
                    type="submit"
                    fullWidth
                    leftIcon={<IconDownload />}
                >
                    Save
                </Button>

            </form>
        </>
    )
}

const SendMaterialRequest = ({ mrp = { id: '', material: { id: '', name: '' }, quantity: '', detailmrp_set: [] }, setaction }) => {

    const { Put, Get } = useRequest()
    const [productList, setProductList] = useState([])
    const [materialList, setMaterialList] = useState([])

    const auth = useContext(AuthContext)
    const dataDetailMrp = mrp.detailmrp_set.map(detail => ({ ...detail, product: detail.product.id }))

    const form = useForm({
        initialValues: {
            id: mrp.id,
            material: mrp.material.id,
            quantity: mrp.quantity,
            detailmrp_set: dataDetailMrp
        }
    })

    useEffect(() => {
        const fetch = async () => {
            try {
                const product = await Get(auth.user.token, 'product-lists')
                const material = await Get(auth.user.token, 'material-lists')

                setProductList(product)
                setMaterialList(material)
            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [])

    const handleSubmit = async (value) => {
        try {
            await Put(value.id, value, auth.user.token, 'mrp-management')
            SuccessNotif('Material request data change is successful')
            setaction(prev => prev + 1)
            closeAllModals()
        } catch (e) {
            console.log(e)
            FailedNotif('Failed to change material request data')
            FailedNotif(e.message.data.detailmrp_set)
        }
    }

    const detailmrp = form.values.detailmrp_set.map((mrp, index) => (
        <Paper p='xs' my='xs' radius='md' shadow='xs' key={index}  >
            <Group>

                <NativeSelect
                    label='product'
                    radius='md'
                    required
                    placeholder="Select product"
                    data={productList.map(product => ({ value: product.id, label: product.name }))}
                    {...form.getInputProps(`detailmrp_set.${index}.product`)}
                />
                <ActionIcon
                    color="red"
                    mt='lg'
                    onClick={() => {
                        form.removeListItem(`detailmrp_set`, index)
                    }}
                >
                    <IconTrash />
                </ActionIcon>
            </Group>
            <Group>

                <NumberInput
                    hideControls
                    label='Qty need'
                    radius='md'
                    required
                    placeholder="Qty material need for this product"
                    {...form.getInputProps(`detailmrp_set.${index}.quantity`)}
                />
                <NumberInput
                    hideControls
                    label='qty production'
                    radius='md'
                    required
                    placeholder="Qty production of this product"
                    {...form.getInputProps(`detailmrp_set.${index}.quantity_production`)}
                />
            </Group>
        </Paper>
    ))

    return (
        <>
            <form id='formRequestMaterial' onSubmit={form.onSubmit(handleSubmit)}  >

                <NativeSelect
                    label='Material'
                    required
                    data={materialList.map(material => ({ value: material.id, label: material.name }))}
                    radius='md'
                    {...form.getInputProps('material')}
                />

                <NumberInput
                    label='Quantity'
                    radius='md'
                    required
                    {...form.getInputProps('quantity')}
                />
                <Divider mt="xl" mb='xs' variant='dashed' label="Production" />
                {detailmrp}

                <Button
                    radius='md'
                    leftIcon={<IconPlus />}
                    onClick={() => {
                        form.insertListItem(`detailmrp_set`, {
                            product: '',
                            quantity: '',
                            quantity_production: ''
                        })
                    }}
                >
                    Product
                </Button>

                <Button
                    radius='md'
                    my='md'
                    form="formRequestMaterial"
                    type="submit"
                    fullWidth
                    leftIcon={<IconDownload />}
                >
                    Save
                </Button>

            </form>
        </>
    )

}


const EditUnitOfMaterial = ({ uom, setaction }) => {

    const [name, setName] = useState('')
    const auth = useContext(AuthContext)
    const { Put } = useRequest()

    useEffect(() => {
        setName(uom.name)
    }, [auth.user.token, uom])

    const handleSubmit = async () => {
        try {
            await Put(uom.id, { name: name }, auth.user.token, 'uom-management')
            setaction(prev => prev + 1)
            SuccessNotif('Edit unit of material success')
            closeAllModals()
        } catch (e) {
            console.log(e)
            FailedNotif('Edit unit of material failed')
        }
    }


    const openConfirmSubmit = () => openConfirmModal({
        title: `Edit unit of material name`,
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
            }}   >

                <TextInput
                    radius='md'
                    value={name}
                    required
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                />

                <Button
                    my='md'
                    radius='md'
                    type="submit"
                    fullWidth
                    disabled={name === '' || name === uom.name}
                >
                    Save
                </Button>
            </form>
        </>
    )
}

const PostUnitOfMaterial = ({ setaction }) => {
    const [name, setName] = useState('')
    const auth = useContext(AuthContext)
    const { Post } = useRequest()


    const handleSubmit = async () => {
        try {
            await Post({ name: name }, auth.user.token, 'uom-management')
            setaction(prev => prev + 1)
            SuccessNotif('Add unit of material success')
            closeAllModals()
        } catch (e) {
            console.log(e)
            FailedNotif('Add unit of material failed')
        }
    }

    const openConfirmSubmit = () => openConfirmModal({
        title: `Add unit of material`,
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
                    label='Uom name'
                    placeholder="Input name of new unit of material"
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


export default function Materials() {

    const auth = useContext(AuthContext)
    const { classes } = sectionStyle()
    const { Get, Delete } = useRequest()
    const [searchVal, setSearchVal] = useState('')

    const [supplierMaterial, setSupplierMaterial] = useState([])
    const [mrp, setMrp] = useState([])
    const [mrpRecommendation, setMrpRecommendation] = useState([])
    const [uoms, setUoms] = useState([])

    const [action, setAction] = useState(0)
    const [mrpAction, setMrpAction] = useState(0)
    const [uomAction, setUomAction] = useState(0)

    const filteredSupplierMaterial = useMemo(() => {
        const valFiltered = searchVal.toLowerCase()

        return supplierMaterial.reduce((prev, current) => {
            const materials = current.ppic_material_related.filter(material => material.spec.toLowerCase().includes(valFiltered) || material.name.toLowerCase().includes(valFiltered) || material.uom.name.toLowerCase().includes(valFiltered))

            if (valFiltered === '') {
                return [...prev, current]
            }

            if (materials.length !== 0) {
                return [...prev, { ...current, ppic_material_related: materials }]
            } else {
                return prev
            }

        }, [])
    }, [searchVal, supplierMaterial])

    const columnSupplier = useMemo(() => [
        {
            name: 'Supplier name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Amount of material',
            selector: row => row.ppic_material_related.length
        }
    ], [])

    const columnMrpRecommendations = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.material.name,
            sortable: true
        },
        {
            name: 'Quantity needed',
            selector: row => row.quantity
        },
        {
            name: '',
            selector: row => row.button
        }
    ], [])

    const columnMrp = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.material.name,
            sortable: true
        },
        {
            name: 'Quantity needed',
            selector: row => row.quantity
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

    const columnUoms = useMemo(() => [
        {
            name: 'Unit of material',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Amount of material',
            selector: row => row.materials
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
            "label": "Materials",
            "link": "#material",
            "order": 1
        },
        {
            "label": 'Material requirement planning',
            "link": '#mrp',
            'order': 1
        },
        {
            "label": 'Recommendations',
            "link": '#mrp-recommendation',
            'order': 2
        },
        {
            "label": 'Unit of material',
            "link": '#uom',
            'order': 1
        },
    ]


    const breadcrumb = [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/material',
            label: 'Material'
        }
    ]


    const openMakeRequestModal = (mrp) => openModal({
        title: `Make request for ${mrp.material.name}`,
        radius: 'md',
        children: <MakeRequestMaterial mrp={mrp} setaction={setMrpAction} />,
    });

    const openEditUomModal = (uom) => openModal({
        title: `Edit unit of material`,
        radius: 'md',
        children: <EditUnitOfMaterial uom={uom} setaction={setUomAction} />,
    });

    const openPostUomModal = () => openModal({
        title: `Add unit of material`,
        radius: 'md',
        children: <PostUnitOfMaterial setaction={setUomAction} />,
    });

    const openEditMrpModal = (mrp) => openModal({
        title: 'Edit material request',
        size: 'xl',
        radius: 'md',
        children: <SendMaterialRequest mrp={mrp} setaction={setMrpAction} />
    })

    const openPostMrpModal = () => openModal({
        title: 'Add material request',
        size: 'xl',
        radius: 'md',
        children: <PostMaterialRequest setaction={setMrpAction} />
    })


    const openDeleteMrp = (id) => openConfirmModal({
        title: `Delete material request`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteMrp(id)
    })

    const handleDeleteMrp = async (id) => {
        try {
            await Delete(id, auth.user.token, 'mrp-management')
            setMrpAction(prev => prev + 1)
            SuccessNotif('Delete mrp success')
        } catch (e) {
            console.log(e)
            FailedNotif('Delete mrp failed')
        }
    }

    const openDeleteUom = (id) => openConfirmModal({
        title: `Delete unit of material`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteUom(id)
    })

    const handleDeleteUom = async (id) => {
        try {
            await Delete(id, auth.user.token, 'uom-management')
            setUomAction(prev => prev + 1)
            SuccessNotif('Delete unit of material success')
        } catch (e) {
            console.log(e)
            FailedNotif('Delete unit of material failed')
        }
    }

    useEffect(() => {

        // effect for supplier nested to materials

        const fetchMaterials = async () => {
            try {
                const supplierMaterials = await Get(auth.user.token, 'supplier-material-list')

                setSupplierMaterial(supplierMaterials)

            } catch (e) {
                console.log(e)
            }
        }

        fetchMaterials()

    }, [auth.user.token, action])


    useEffect(() => {

        // effect for mrp and mrp recommendations

        const fetchMrp = async () => {
            try {
                const recommendationMrp = await Get(auth.user.token, 'mrp-management')
                const mrps = await Get(auth.user.token, 'mrp-details')


                const recomendMrp = recommendationMrp.map(mrp => ({
                    ...mrp, button: <Button
                        leftIcon={<IconSend stroke={2} size={16} />}
                        color='teal.8'
                        variant='subtle'
                        radius='md'
                        onClick={() => openMakeRequestModal(mrp)}
                    >
                        Make a request
                    </Button>
                }))

                const dataMrp = mrps.map(mrp => ({
                    ...mrp, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='teal.8'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditMrpModal(mrp)}
                        >
                            Edit
                        </Button>,
                    buttonDelete: <Button
                        leftIcon={<IconTrash stroke={2} size={16} />}
                        color='red'
                        variant='subtle'
                        radius='md'
                        onClick={() => openDeleteMrp(mrp.id)}
                    >
                        Delete
                    </Button>

                }))

                setMrpRecommendation(recomendMrp)
                setMrp(dataMrp)

            } catch (e) {
                console.log(e)
            }
        }

        fetchMrp()

    }, [auth.user.token, mrpAction])


    useEffect(() => {

        // effect for unit of material

        const fetchUom = async () => {
            try {
                const uoms = await Get(auth.user.token, 'uom-list')
                const unitOfMaterials = uoms.map(uom => ({
                    ...uom, buttonEdit:

                        <Button
                            leftIcon={<IconEdit stroke={2} size={16} />}
                            color='teal.8'
                            variant='subtle'
                            radius='md'
                            mx='xs'
                            onClick={() => openEditUomModal(uom)}
                        >
                            Edit
                        </Button>,
                    buttonDelete: <Button
                        leftIcon={<IconTrash stroke={2} size={16} />}
                        color='red'
                        variant='subtle'
                        radius='md'
                        onClick={() => openDeleteUom(uom.id)}
                    >
                        Delete
                    </Button>
                }))

                setUoms(unitOfMaterials)
            } catch (e) {
                console.log(e)
            }
        }

        fetchUom()

    }, [auth.user.token, uomAction])


    return (
        <>
            <BreadCrumb links={breadcrumb} />
            <BaseAside links={links} activeSection={activeSection} />

            <section id='material' className={classes.section} ref={sectionRefs[0]}  >
                <Title className={classes.title} >
                    <a href="#material" className={classes.a_href} >
                        Materials
                    </a>
                </Title>



                <Group position="right" >
                    <TextInput
                        icon={<IconSearch />}
                        placeholder='Search material'
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
                        Add material
                    </Button>

                </Group>


                <BaseTableDefaultExpanded

                    column={columnSupplier}
                    data={filteredSupplierMaterial}
                    expandComponent={ExpandedMaterial}
                    condition={row => row.ppic_material_related.length !== 0}
                />
            </section>


            <section id='mrp' className={classes.section} ref={sectionRefs[1]}  >
                <Title className={classes.title} >
                    <a href="#mrp" className={classes.a_href} >
                        Material requirement planning
                    </a>
                </Title>

                <Group position="right" >
                    <Button
                        leftIcon={<IconPlus />}
                        radius='md'
                        variant='outline'
                        onClick={openPostMrpModal}
                    >
                        Add mrp
                    </Button>
                </Group>

                <BaseTableExpanded
                    column={columnMrp}
                    data={mrp}
                    expandComponent={ExpandedMrpRecommendation}

                />


            </section>

            <section id='mrp-recommendation' className={classes.section} ref={sectionRefs[2]}  >
                <Title className={classes.title} >
                    <a href="#mrp-recommendation" className={classes.a_href} >
                        Recommendations
                    </a>
                </Title>

                <p>
                    This section contains material requirements to fulfill product orders
                </p>

                <BaseTableExpanded
                    column={columnMrpRecommendations}
                    data={mrpRecommendation}
                    expandComponent={ExpandedMrpRecommendation}

                />

            </section>


            <section id='uom' className={classes.section} ref={sectionRefs[3]}  >
                <Title className={classes.title} >
                    <a href="#uom" className={classes.a_href} >
                        Unit of material
                    </a>
                </Title>

                <Group position="right" >
                    <Button
                        leftIcon={<IconPlus />}
                        radius='md'
                        onClick={openPostUomModal}
                        variant='outline'
                    >
                        Add unit of material
                    </Button>
                </Group>

                <BaseTable
                    column={columnUoms}
                    data={uoms}
                    pagination={false}
                />

            </section>


        </>

    )
}









