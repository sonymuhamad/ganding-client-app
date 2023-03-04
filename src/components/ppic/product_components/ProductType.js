import React, { useState, useEffect, useMemo, useCallback } from "react"
import { TextInput } from "@mantine/core"
import { IconSignature } from "@tabler/icons"
import { closeAllModals, openModal } from "@mantine/modals";
import { useForm } from "@mantine/form"

import { BaseTable } from "../../tables"
import { useConfirmDelete, useRequest, useNotification } from "../../../hooks"
import { ModalForm, ButtonAdd, ButtonDelete, ButtonEdit, HeadSection } from "../../custom_components"


const AddProductType = ({ setAddProductType }) => {

    const { successNotif, failedNotif } = useNotification()
    const { Post } = useRequest()
    const form = useForm({
        initialValues: {
            name: ''
        }
    })

    const handleSubmit = useCallback(async (value) => {
        try {
            const newProductType = await Post(value, 'type/product-management')
            setAddProductType(newProductType)
            closeAllModals()
            successNotif('Add product type success')
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Add product type failed')
        }

    }, [Post, setAddProductType, successNotif, failedNotif])



    return (
        <ModalForm
            formId='formAddProductType'
            onSubmit={form.onSubmit(handleSubmit)}  >

            <TextInput
                icon={<IconSignature />}
                radius='md'
                required
                label='Type name'
                placeholder="Input name of new type"
                {...form.getInputProps('name')}
            />

        </ModalForm>

    )
}


const EditProductType = ({ setUpdateProductType, data }) => {

    const { successNotif, failedNotif } = useNotification()
    const form = useForm({
        initialValues: {
            name: data.name
        }
    })

    const { Put } = useRequest()

    const handleSubmit = useCallback(async (value) => {
        try {
            const updatedProductType = await Put(data.id, value, 'type/product-management')
            setUpdateProductType(updatedProductType)
            closeAllModals()
            successNotif('Edit product type success')
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Edit product type failed')
        }
    }, [setUpdateProductType, data.id, failedNotif, successNotif])


    return (
        <ModalForm
            formId='formEditProductType'
            onSubmit={form.onSubmit(handleSubmit)}  >

            <TextInput
                icon={<IconSignature />}
                radius='md'
                label='Type'
                required
                {...form.getInputProps('name')}
            />

        </ModalForm>
    )
}


const ProductType = () => {

    const { successNotif, failedNotif } = useNotification()
    const [productType, setProductType] = useState([])
    const { Get, Delete } = useRequest()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Product type' })

    const setAddProductType = useCallback((newProductType) => {
        setProductType(prev => [...prev, newProductType])
    }, [])

    const setUpdateProductType = useCallback((updatedProductType) => {
        const { name, id } = updatedProductType

        return setProductType(prev => {
            return prev.map(productType => {
                if (productType.id === id) {
                    return { ...productType, name: name }
                }
                return productType
            })
        })

    }, [])

    const setDeleteProductType = useCallback((idDeletedProductType) => {
        setProductType(prev => prev.filter(productType => productType.id !== idDeletedProductType))
    }, [])

    const openAddProductType = useCallback(() => openModal({
        title: `Add product type`,
        radius: 'md',
        children: <AddProductType
            setAddProductType={setAddProductType} />,
    }), [setAddProductType])

    const openEditProductType = useCallback((data) => openModal({
        title: `Edit product type`,
        radius: 'md',
        children: <EditProductType
            data={data}
            setUpdateProductType={setUpdateProductType} />
    }), [setUpdateProductType])

    const handleDeleteProductType = useCallback(async (id) => {
        try {
            await Delete(id, 'type/product-management')
            setDeleteProductType(id)
            successNotif('Delete product type success')
        } catch (e) {
            failedNotif(e, 'Delete product type failed')
        }
    }, [setDeleteProductType, successNotif, failedNotif])

    useEffect(() => {
        // effect for product type

        const fetchProductType = async () => {
            try {
                const product_type = await Get('type/product')
                setProductType(product_type)
            } catch (e) {
                console.log(e)
            }
        }

        fetchProductType()

    }, [])


    const columnProductType = useMemo(() => [
        {
            name: 'Type',
            selector: row => row.name
        },
        {
            name: 'Amount of product',
            selector: row => row.products ? row.products : 0
        },
        {
            name: '',
            selector: row => <ButtonEdit
                onClick={() => openEditProductType(row)}
            />
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openConfirmDeleteData(() => handleDeleteProductType(row.id))}
            />
        }
    ], [openEditProductType, openConfirmDeleteData, handleDeleteProductType])

    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openAddProductType}
                >
                    Product type
                </ButtonAdd>
            </HeadSection>

            <BaseTable
                column={columnProductType}
                data={productType}

            />

        </>
    )
}


export default ProductType