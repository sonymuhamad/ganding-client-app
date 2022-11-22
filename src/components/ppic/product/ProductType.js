import React, { useState, useEffect, useMemo, useCallback } from "react"

import { useRequest } from "../../../hooks/useRequest"

import BaseTable from "../../tables/BaseTable"
import { Group, Button, TextInput, Text } from "@mantine/core"
import { IconTrash, IconPlus, IconEdit, IconSignature, IconDownload } from "@tabler/icons"
import { FailedNotif, SuccessNotif } from "../../notifications/Notifications";
import { openConfirmModal, closeAllModals, openModal } from "@mantine/modals";
import { useForm } from "@mantine/form"



const AddProductType = ({ setaction }) => {

    const { Post, Loading } = useRequest()
    const form = useForm({
        initialValues: {
            name: ''
        }
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            await Post(value, 'product-type')
            setaction(prev => prev + 1)
            closeAllModals()
            SuccessNotif('Add product type success')
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Add product type failed')
        }
    }
        , [Post, setaction])



    return (
        <>
            <Loading />
            <form onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    icon={<IconSignature />}
                    radius='md'
                    required
                    label='Type name'
                    placeholder="Input name of new type"
                    {...form.getInputProps('name')}
                />

                <Button
                    leftIcon={<IconDownload />}
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


const EditProductType = ({ setaction, data }) => {

    const form = useForm({
        initialValues: {
            name: data.name
        }
    })

    const { Put, Loading } = useRequest()

    const handleSubmit = useCallback(async (value) => {
        try {
            await Put(data.id, value, 'product-type')
            closeAllModals()
            setaction(prev => prev + 1)
            SuccessNotif('Edit product type success')
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit product type failed')
        }
    }, [Put, setaction, data.id])


    return (
        <>
            <Loading />
            <form onSubmit={form.onSubmit(handleSubmit)}  >

                <TextInput
                    icon={<IconSignature />}
                    radius='md'
                    label='Type'
                    required
                    {...form.getInputProps('name')}
                />

                <Button
                    leftIcon={<IconDownload />}
                    my='md'
                    radius='md'
                    type="submit"
                    fullWidth
                    disabled={data.name === form.values.name}
                >
                    Save
                </Button>

            </form>
        </>
    )
}


const ProductType = () => {

    const [productType, setProductType] = useState([])
    const [actionProductType, setActionProductType] = useState(0)
    const { Get, Delete } = useRequest()


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

    const openAddProductType = useCallback(() => openModal({
        title: `Add product type`,
        radius: 'md',
        children: <AddProductType setaction={setActionProductType} />,
    }), [])


    const openEditProductType = useCallback((data) => openModal({
        title: `Edit product type`,
        radius: 'md',
        children: <EditProductType data={data} setaction={setActionProductType} />
    }), [])

    const handleDeleteProductType = useCallback(async (id) => {
        try {
            await Delete(id, 'product-type')
            setActionProductType(prev => prev + 1)
            SuccessNotif('Delete product type success')
        } catch (e) {
            console.log(e)
            FailedNotif('Delete product type failed')
            FailedNotif(e.message.data)
        }
    }, [])



    const openDeleteProductTypeModal = useCallback((id) => openConfirmModal({
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
    }), [handleDeleteProductType])


    useEffect(() => {
        // effect for product type

        const fetchProductType = async () => {
            try {
                const product_type = await Get('product-type')
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

    }, [actionProductType, openEditProductType, openDeleteProductTypeModal])

    return (
        <>

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

        </>
    )
}


export default ProductType