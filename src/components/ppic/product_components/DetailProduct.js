import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import useScrollSpy from 'react-use-scrollspy'

import { IconFileTypography, IconList, IconCodeAsterix, IconBarbell, IconTrashX, IconDownload, IconEdit, IconX, IconUser, IconBuildingWarehouse, IconDialpad, IconTrash, IconPlus, IconAsset, IconBarcode, IconTransferIn, IconTransferOut, IconTimeline, IconLayoutKanban, IconUpload, IconSum, IconArrowsSort } from "@tabler/icons"

import { Title, TextInput, Group, Paper, Image, Button, FileButton, Text, Badge, ActionIcon, Divider, NumberInput, Center, UnstyledButton, Select } from "@mantine/core"
import { useForm } from "@mantine/form"
import { openConfirmModal } from "@mantine/modals"

import { BaseAside } from "../../layout"
import BreadCrumb from "../../BreadCrumb"
import { BaseTable, BaseTableExpanded } from "../../tables"
import { useRequest } from '../../../hooks'
import { SuccessNotif, FailedNotif } from '../../notifications'
import { sectionStyle } from "../../../styles"


const ExpandedProduct = ({ data }) => {

    const findQuantitySubcont = useCallback((dataProduct) => {

        // preventing error occured when changing process type from subcont to non subcont

        if (dataProduct.process_type === 2) {
            return data.warehouseproduct_set.find(wh => wh.warehouse_type.id === 2).quantity
        } else {
            return 0
        }
    }, [data])

    const quantitySubcont = findQuantitySubcont(data)

    return (
        <>
            <Group m='lg' grow >
                <TextInput
                    label='Quantity at supplier'
                    radius='md'
                    icon={<IconDialpad />}
                    readOnly
                    defaultValue={quantitySubcont}
                />
                <TextInput
                    label='Quantity at warehouse'
                    icon={<IconBuildingWarehouse />}
                    defaultValue={data.warehouseproduct_set.find(wh => wh.warehouse_type.id !== 2).quantity}
                    radius='md'
                    readOnly
                />
            </Group>
        </>
    )
}



const DetailProduct = () => {

    const params = useParams()
    const { Retrieve, Get, Put, Delete, Loading, Post } = useRequest()
    const { classes } = sectionStyle()
    const [breadcrumb, setBreadcrumb] = useState([])
    const [productType, setProductType] = useState([])
    const [processType, setProcessType] = useState([])
    const [editAccess, setEditAcces] = useState(false)
    const [action, setAction] = useState(0)
    const navigate = useNavigate()
    const [productList, setProductList] = useState([])
    const [materialList, setMaterialList] = useState([])
    const [processEditAccess, setProcessEditAccess] = useState(null)

    const [product, setProduct] = useState({
        id: '',
        code: '',
        image: null,
        name: '',
        customer: '',
        customerName: '',
        process: '',
        weight: '',
        productordered: 0,
        productdelivered: 0,
        price: 0,
        type: '',
        ppic_process_related: [],
        ppic_productorder_related: [],
    })


    const form = useForm({

        initialValues: {
            id: '',
            code: '',
            image: null,
            name: '',
            customer: '',
            process: '',
            weight: '',
            productordered: 0,
            productdelivered: 0,
            type: '',
            ppic_process_related: [],
        }

    })

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
            "label": "Detail product",
            "link": "#detail-product",
            "order": 1
        },
        {
            "label": 'Manufacturing process',
            "link": '#process',
            'order': 1
        },
        {
            "label": "Wip and finish good",
            "link": "#wip-fg",
            "order": 1
        },
        {
            "label": "Order related",
            "link": "#order-related",
            "order": 1
        }
    ]

    const columnOrderRelated = useMemo(() => [
        {
            name: 'Order number',
            selector: row => row.sales_order.code
        },
        {
            name: 'Date',
            selector: row => row.sales_order.date,
            sortable: true,
        },
        {
            name: 'Sent/order',
            selector: row => `${row.delivered} / ${row.ordered}`
        },
        {
            name: 'Status',
            selector: row => row.done ? 'Finished' : 'Unfinished'
        }
    ], [])



    const columnProcess = useMemo(() => [
        {
            name: 'Process name',
            selector: row => row.process_name,
            sortable: true,
        },
        {
            name: 'Process type',
            selector: row => row.process_type_name,
        },
        {
            name: 'Wip',
            selector: row => `Process ${row.order}`,
        },
        {
            name: 'Stock',
            selector: row => row.warehouseproduct_set.find(wh => wh.warehouse_type.id !== 2).quantity,
        },
        {
            name: 'Warehouse',
            selector: row => row.warehouseproduct_set.find(wh => wh.warehouse_type.id !== 2).warehouse_type.name,
        },

    ], [])


    const checkDataProduct = useCallback((value) => {

        // remove one to one relations with depth >= 1

        const { ppic_productorder_related, ...restData } = value

        const dataFormProduct = {
            ...restData, ppic_process_related: restData.ppic_process_related.map(process => {
                const { warehouseproduct_set, ...restProps } = process
                return restProps
            })
        }

        if (typeof dataFormProduct.image === 'string') {
            // checking type of image field first, to prevent error from content-type in server
            const { image, ...data } = dataFormProduct
            return data
        } else {
            const data = dataFormProduct
            return data
        }
    }, [])


    const handleClickEditButton = useCallback(() => {
        setEditAcces((prev) => !prev)
        if (form.isDirty()) {

            form.resetDirty()
            form.setValues(product)

        }
    }, [product, form])


    const handleEditProduct = useCallback(async (val) => {

        // handler for submit edit product

        const dataProduct = checkDataProduct(val)

        try {
            await Put(val.id, dataProduct, 'product-management', 'multipart/form-data')
            setAction(prev => prev + 1)
            SuccessNotif('Product updated')
        } catch (e) {
            console.log(e)
            FailedNotif('Update product failed')
            form.setErrors(e.message.data)
        } finally {
            handleClickEditButton()
        }

    }, [handleClickEditButton, checkDataProduct, form])

    const handleDeleteProduct = useCallback(async () => {

        // handler for delete product

        try {
            await Delete(params.productId, 'product-management')
            SuccessNotif('Delete product success')
            navigate('/home/ppic/product')
        } catch (e) {
            FailedNotif(e.message.data[0])
            console.log(e)
        }
    }, [navigate])

    const handleClickProcessEditAccess = useCallback((index) => {

        if (index + 1 === processEditAccess || index === undefined) {
            setProcessEditAccess(null)
            form.resetDirty(`ppic_process_related`)
            form.setFieldValue(`ppic_process_related`, product.ppic_process_related)

        } else {
            setProcessEditAccess(index + 1)
        }
    }, [product, processEditAccess, form])

    const handleDeleteProcess = useCallback(async (id) => {

        try {
            await Delete(id, 'process-management')
            SuccessNotif('Delete process success')
            setAction(prev => prev + 1)

        } catch (e) {
            console.log(e)
            FailedNotif('Delete process failed')
            handleClickProcessEditAccess()
        }

    }, [handleClickProcessEditAccess])

    const handleSubmitEditProcess = useCallback(async (val) => {


        const dataProduct = checkDataProduct(val)
        const { ppic_process_related, id } = dataProduct
        const submittedProcess = ppic_process_related[(processEditAccess - 1)]

        const process = { ...submittedProcess, product: id }

        try {

            if (process.id) {
                await Put(process.id, process, 'process-management')
                SuccessNotif('Edit data success')
            } else {
                await Post(process, 'process-management')
                SuccessNotif('Add process success')
            }

            setProcessEditAccess(null)
            setAction(prev => prev + 1)

        } catch (e) {
            handleClickProcessEditAccess()
            if (e.message.data.order) {
                FailedNotif(e.message.data.order)
            } else if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
            } else {
                FailedNotif('Edit data failed')
            }

        }

    }, [checkDataProduct, handleClickProcessEditAccess, processEditAccess])

    const openSubmitEditModal = useCallback((val) => openConfirmModal({
        title: `Edit product`,
        children: (
            <Text size="sm">
                Are you sure?, detail product will changed.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, change', cancel: "No, don't change it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onCancel: () => handleClickEditButton(),
        onConfirm: () => handleEditProduct(val)
    }), [handleClickEditButton, handleEditProduct])

    const openDeleteModal = useCallback(() => openConfirmModal({
        title: 'Delete product',
        children: (
            <Text size='md' >
                Are you sure, this product will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes,delete ', cancel: "No, don't delete it " },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteProduct()
    }), [handleDeleteProduct])


    const openSubmitEditProcess = useCallback((val) => openConfirmModal({
        title: `Save changes`,
        children: (
            <Text size="sm">
                Are you sure?, data will be saved.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, save changes', cancel: "No, don't save it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onCancel: () => handleClickProcessEditAccess(),
        onConfirm: () => handleSubmitEditProcess(val)
    }), [handleClickProcessEditAccess, handleSubmitEditProcess])

    const openDeleteProcess = useCallback((id) => openConfirmModal({
        title: `Delete process`,
        children: (
            <Text size="sm">
                Are you sure?, data related to this manufacturing process will also be deleted, including every production report.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteProcess(id)
    }), [handleDeleteProcess])



    const totalStock = useMemo(() => {
        return product.ppic_process_related.reduce((prev, current) => {

            for (const wh of current.warehouseproduct_set) {
                prev += wh.quantity
            }

            return prev

        }, 0)

    }, [product])

    useEffect(() => {
        const fetch = async () => {
            try {
                const product = await Retrieve(params.productId, 'product-detail')
                const productType = await Get('product-type')
                const processType = await Get('process-type')
                const productLists = await Get('product-lists')
                const materialLists = await Get('material-lists')

                const detailProduct = { ...product, customer: product.customer.id, customerName: product.customer.name, type: product.type.id, ppic_process_related: product.ppic_process_related.map(process => ({ ...process, process_type_name: process.process_type.name, process_type: process.process_type.id, requirementmaterial_set: process.requirementmaterial_set.map(material => ({ ...material, material: material.material.id })), requirementproduct_set: process.requirementproduct_set.map(product => ({ ...product, product: product.product.id })) })) }



                setProcessType(processType)
                setProductType(productType)
                setProductList(productLists)
                setMaterialList(materialLists)

                setProduct(detailProduct)
                form.setValues(detailProduct)
                form.resetDirty()

                setBreadcrumb([
                    {
                        path: '/home/ppic',
                        label: 'Ppic'
                    },
                    {
                        path: '/home/ppic/product',
                        label: 'Product'
                    },
                    {
                        path: `/home/ppic/product/${product.id}`,
                        label: `${product.name}`
                    }
                ])


            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [action,])

    const manufacturingProcess = useMemo(() => {
        return <form id='processForm' onSubmit={form.onSubmit(openSubmitEditProcess)} >

            {form.values.ppic_process_related.map((process, index) => (

                <Paper style={{ border: `1px solid #ced4da` }} radius='md' shadow='xs' p='xs' key={`${process.id}${index}`} mt='lg' mb='sm'  >

                    <UnstyledButton>
                        <Group>
                            <IconTimeline />
                            <div>
                                <Text>Process {process.order}</Text>
                            </div>
                        </Group>
                    </UnstyledButton>

                    <Group position="right"   >
                        <Button.Group>

                            <Button
                                size='xs'
                                radius='md'
                                color={!processEditAccess ? 'blue.6' : 'red.6'}
                                onClick={() => handleClickProcessEditAccess(index)}
                                disabled={!processEditAccess ? false : processEditAccess !== index + 1}
                                leftIcon={!processEditAccess ? <IconEdit /> : processEditAccess === index + 1 ? <IconX /> : <IconEdit />}
                            >
                                {!processEditAccess ? 'Edit' : processEditAccess === index + 1 ? 'Cancel' : 'Edit'}
                            </Button>

                            <Button
                                type="submit"
                                form='processForm'
                                size='xs'
                                color='blue.6'
                                disabled={form.isDirty(`ppic_process_related.${index}`) ? false : true}
                                leftIcon={<IconDownload />} >
                                Save Changes</Button>

                            <Button
                                size='xs'
                                color='red.6'
                                onClick={() => openDeleteProcess(process.id)}
                                radius='md'
                                disabled={!processEditAccess ? false : true}
                                leftIcon={<IconTrashX />} >
                                Delete</Button>
                        </Button.Group>
                    </Group>

                    <TextInput
                        label='Process name'
                        radius='md'
                        my='xs'
                        required
                        icon={<IconLayoutKanban />}
                        readOnly={!processEditAccess ? true : processEditAccess !== index + 1}
                        {...form.getInputProps(`ppic_process_related.${index}.process_name`)}
                    />

                    <Select
                        my='xs'
                        label='Process type'
                        placeholder="Select process type"
                        radius='md'
                        required
                        icon={<IconFileTypography />}
                        readOnly={!processEditAccess ? true : processEditAccess !== index + 1}
                        data={processType.map(type => ({ value: type.id, label: type.name }))}
                        {...form.getInputProps(`ppic_process_related.${index}.process_type`)}
                        key={`${process.id}${index}`}
                    />

                    <NumberInput
                        hideControls
                        label='Wip'
                        radius='md'
                        my='xs'
                        required
                        icon={<IconArrowsSort />}
                        disabled={!processEditAccess ? true : processEditAccess !== index + 1}
                        {...form.getInputProps(`ppic_process_related.${index}.order`)}
                    />

                    <Divider mt="xl" mb='xs' size='md' label="Bill of material" />
                    {form.values.ppic_process_related[index].requirementmaterial_set.length === 0 &&
                        <Text my='md' size='sm' align="center" color='dimmed'  >
                            This process has no bill of material
                        </Text>
                    }
                    {form.values.ppic_process_related[index].requirementmaterial_set.map((reqMaterial, j) => (
                        <Paper ml='lg' mb='xs' key={`${reqMaterial.id}${j}`} >

                            <Group position="right" >
                                <ActionIcon
                                    color="red"
                                    mt='lg'
                                    style={{ display: !processEditAccess ? 'none' : processEditAccess !== index + 1 && 'none' }}
                                    onClick={() => {
                                        form.removeListItem(`ppic_process_related.${index}.requirementmaterial_set`, j)
                                        const dirty = `ppic_process_related.${index}`
                                        form.setDirty({ [dirty]: true })
                                    }}
                                >
                                    <IconTrash />
                                </ActionIcon>

                            </Group>

                            <Select
                                required
                                m='xs'
                                radius='md'
                                label='Material'
                                icon={<IconAsset />}
                                placeholder="Select material"
                                readOnly={!processEditAccess ? true : processEditAccess !== index + 1}
                                data={materialList.map(material => ({ value: material.id, label: material.name }))}
                                {...form.getInputProps(`ppic_process_related.${index}.requirementmaterial_set.${j}.material`)}

                            />


                            <Group grow m='xs' >

                                <NumberInput
                                    hideControls
                                    required
                                    radius='md'
                                    placeholder="input quantity of consumption bill of material"
                                    icon={<IconTransferIn />}
                                    label='Consumption'
                                    disabled={!processEditAccess ? true : processEditAccess !== index + 1}
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementmaterial_set.${j}.input`)}
                                />

                                <NumberInput
                                    hideControls
                                    required
                                    icon={<IconTransferOut />}
                                    placeholder='input quantity output product'
                                    disabled={!processEditAccess ? true : processEditAccess !== index + 1}
                                    radius='md'
                                    label='Output'
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementmaterial_set.${j}.output`)}
                                />
                            </Group>


                        </Paper>

                    ))}
                    <Button
                        radius='md'
                        leftIcon={<IconPlus />}
                        color='blue.6'
                        style={{ display: !processEditAccess ? 'none' : processEditAccess !== index + 1 && 'none' }}
                        onClick={() => {
                            form.insertListItem(`ppic_process_related.${index}.requirementmaterial_set`, { material: '', input: '', output: '' })
                            const dirty = `ppic_process_related.${index}`
                            form.setDirty({ [dirty]: true })
                        }}
                    >
                        Add material
                    </Button>

                    <Divider mt="xl" mb='xs' size='md' label="Product assembly" />

                    {form.values.ppic_process_related[index].requirementproduct_set.length === 0 &&
                        <Text my='md' size='sm' color='dimmed' align="center"  >
                            This process has no product assembly
                        </Text>
                    }
                    {form.values.ppic_process_related[index].requirementproduct_set.map((reqProduct, i) => (
                        <Paper ml='lg' mb='xs' key={`${reqProduct.id}${i}`} >

                            <Group position="right"  >
                                <ActionIcon
                                    color="red"
                                    mt='lg'
                                    style={{ display: !processEditAccess ? 'none' : processEditAccess !== index + 1 && 'none' }}
                                    onClick={() => {
                                        form.removeListItem(`ppic_process_related.${index}.requirementproduct_set`, i)
                                        const dirty = `ppic_process_related.${index}`
                                        form.setDirty({ [dirty]: true })
                                    }}
                                >
                                    <IconTrash />
                                </ActionIcon>

                            </Group>

                            <Select
                                required
                                m='xs'
                                radius='md'
                                icon={<IconBarcode />}
                                label='Product'
                                placeholder="Select product"
                                readOnly={!processEditAccess ? true : processEditAccess !== index + 1}
                                data={productList.map(product => ({ value: product.id, label: product.name }))}
                                {...form.getInputProps(`ppic_process_related.${index}.requirementproduct_set.${i}.product`)}

                            />

                            <Group grow m='xs' >

                                <NumberInput
                                    hideControls
                                    required
                                    disabled={!processEditAccess ? true : processEditAccess !== index + 1}
                                    radius='md'
                                    placeholder="input quantity consumption product assembly"
                                    icon={<IconTransferIn />}
                                    label='Consumption'
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementproduct_set.${i}.input`)}
                                />
                                <NumberInput
                                    required
                                    hideControls
                                    placeholder='input quantity output product'
                                    icon={<IconTransferOut />}
                                    disabled={!processEditAccess ? true : processEditAccess !== index + 1}
                                    radius='md'
                                    label='Output'
                                    {...form.getInputProps(`ppic_process_related.${index}.requirementproduct_set.${i}.output`)}
                                />
                            </Group>

                        </Paper>


                    ))}
                    <Button
                        radius='md'
                        leftIcon={<IconPlus />}
                        color='blue.6'
                        style={{ display: !processEditAccess ? 'none' : processEditAccess !== index + 1 && 'none' }}
                        onClick={() => {
                            form.insertListItem(`ppic_process_related.${index}.requirementproduct_set`, {
                                product: '',
                                input: '',
                                output: ''
                            })
                            const dirty = `ppic_process_related.${index}`
                            form.setDirty({ [dirty]: true })
                        }}
                    >
                        Add product assembly
                    </Button>

                </Paper>



            ))}

            {form.values.ppic_process_related.length === 0 &&
                <Text my='md' size='sm' align="center" color='dimmed'  >
                    This product does not have a manufacturing process
                </Text>
            }

            <Center>
                <Button
                    radius='md'
                    leftIcon={<IconPlus />}
                    style={{ display: processEditAccess && 'none' }}
                    onClick={() => {
                        form.insertListItem(`ppic_process_related`, {
                            process_name: '',
                            process_type: '',
                            order: '',
                            requirementmaterial_set: [],
                            requirementproduct_set: []
                        })

                        setProcessEditAccess(form.values.ppic_process_related.length + 1)

                    }}
                >
                    Add process
                </Button>
            </Center>


        </form>

    }, [handleClickProcessEditAccess, materialList, productList, processType, openDeleteProcess, openSubmitEditProcess, processEditAccess, form.values.ppic_process_related])



    return (
        <>
            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />
            <Loading />
            <section id='detail-product' className={classes.section} ref={sectionRefs[0]}  >
                <Title className={classes.title} >
                    <a href="#detail-product" className={classes.a_href} >
                        Detail product
                    </a>
                </Title>



                <Group position="right" mt='md' mb='md'  >
                    <Button.Group>

                        <Button
                            size='xs'
                            radius='md'
                            color={!editAccess ? 'blue.6' : 'red.6'}
                            onClick={handleClickEditButton}
                            leftIcon={!editAccess ? <IconEdit /> : <IconX />}
                        >
                            {!editAccess ? 'Edit' : 'Cancel'}
                        </Button>

                        <Button
                            type="submit"
                            form='formEditProduct'
                            size='xs'
                            color='blue.6'
                            disabled={!editAccess ? true : form.isDirty() ? false : true}
                            leftIcon={<IconDownload />} >
                            Save Changes</Button>
                        <Button
                            size='xs'
                            color='red.6'
                            onClick={openDeleteModal}
                            radius='md'
                            disabled={!editAccess ? false : true}
                            leftIcon={<IconTrashX />} >
                            Delete</Button>
                    </Button.Group>
                </Group>

                <form id="formEditProduct" onSubmit={form.onSubmit(openSubmitEditModal)} >
                    <TextInput
                        required
                        radius='md'
                        readOnly
                        icon={<IconUser />}
                        label='Customer'
                        value={product.customerName}
                    />
                    <TextInput
                        required
                        my='xs'
                        radius='md'
                        label='Product name'
                        readOnly={!editAccess ? true : false}
                        icon={<IconBarcode />}
                        {...form.getInputProps('name')}

                    />
                    <TextInput
                        radius='md'
                        required
                        readOnly={!editAccess ? true : false}
                        icon={<IconCodeAsterix />}
                        label='Product number'
                        {...form.getInputProps('code')}
                    />
                    <Group mt='md' grow >

                        <Select
                            radius='md'
                            required
                            readOnly={!editAccess ? true : false}
                            icon={<IconFileTypography />}
                            label='Product type'
                            {...form.getInputProps('type')}
                            data={productType.map(type => ({ value: type.id, label: type.name }))}
                        />


                        <TextInput
                            readOnly={!editAccess ? true : false}
                            radius='md'
                            required
                            icon={<IconBarbell />}
                            label='Weight per piece'
                            {...form.getInputProps('weight')}
                        />

                    </Group>
                    <Group grow mt='md' >

                        <TextInput
                            radius='md'
                            readOnly
                            icon={<IconList />}
                            label='Number of process'
                            {...form.getInputProps('process')}
                        />

                        <TextInput
                            label='Total stock'
                            icon={<IconSum />}
                            radius='md'
                            value={totalStock}
                            readOnly
                        />
                    </Group>

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
                        style={{ display: !editAccess ? 'none' : form.values.image === null ? '' : 'none' }}
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
                        style={{ display: !editAccess ? 'none' : form.values.image !== null ? '' : 'none' }} >
                        Delete image
                    </Button>

                    {form.values.image && (
                        <Text size="sm" color='dimmed' align="center" mt="sm">
                            {form.values.image.name}
                        </Text>
                    )}
                </Group>


            </section>

            <section id='process' className={classes.section} ref={sectionRefs[1]}  >
                <Title className={classes.title} >
                    <a href="#process" className={classes.a_href} >
                        Manufacturing process
                    </a>
                </Title>

                {manufacturingProcess}

            </section>


            <section id='wip-fg' className={classes.section} ref={sectionRefs[2]}  >
                <Title className={classes.title} >
                    <a href="#wip-fg" className={classes.a_href} >
                        Wip and finish good
                    </a>
                </Title>

                <BaseTableDisableExpanded
                    column={columnProcess}
                    data={product.ppic_process_related}
                    expandComponent={ExpandedProduct}
                    condition={row => row.process_type === 2}
                    disabled={row => row.process_type !== 2}
                    pagination={false}
                />

            </section>

            <section id='order-related' className={classes.section} ref={sectionRefs[3]}  >
                <Title className={classes.title} >
                    <a href="#order-related" className={classes.a_href} >
                        Order related
                    </a>
                </Title>

                <Group>
                    <Badge color='green' variant="filled" >Finished</Badge>
                    <Badge color='blue' variant='filled' >On progress</Badge>
                </Group>

                <BaseTable

                    column={columnOrderRelated}
                    data={product.ppic_productorder_related}
                    conditionalRowStyle={
                        [
                            {
                                when: row => row.done,
                                style: {
                                    backgroundColor: '#b2f2bb',
                                    color: 'white',
                                },
                            },
                            {
                                when: row => row.delivered,
                                style: {
                                    backgroundColor: '#a5d8ff',
                                    color: 'white',
                                },
                            }
                        ]
                    }

                />

            </section>


        </>
    )

}

export default DetailProduct
