
//// List of product order from detail sales order 

import { Group, NumberInput, Select, TextInput } from "@mantine/core"
import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useRequest, useConfirmDelete, useNotification } from "../../../../hooks"
import { BaseTable } from "../../../tables"

import { closeAllModals, openModal } from "@mantine/modals"
import { IconBarcode, IconClipboardCheck, IconCodeAsterix, IconTruckDelivery } from "@tabler/icons"
import { useForm } from "@mantine/form"
import { CustomSelectComponentProduct } from "../../../layout"

import { HeadSection, ButtonAdd, ButtonDelete, ButtonEdit, PriceTextInput, ModalForm } from "../../../custom_components"



const ModalEditProductOrder = ({ salesOrderId, data, handleChangeProductOrder }) => {

    const { product, delivered, ...rest } = data
    const { name, code, id } = product
    const { Put } = useRequest()
    const { successNotif, failedNotif } = useNotification()

    const form = useForm({
        initialValues: {
            product: id,
            sales_order: salesOrderId,
            ...rest
        }
    })

    const handleSubmit = async (value) => {
        try {
            const updatedPo = await Put(value.id, value, 'product-order-management')
            successNotif('Edit product order success')
            handleChangeProductOrder(updatedPo)
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Edit product order failed')
        }
    }


    return (
        <ModalForm
            onSubmit={form.onSubmit(handleSubmit)} id='formEditProductOrder' >

            <TextInput
                label='Product'
                variant='filled'
                readOnly
                value={name}
                icon={<IconBarcode />}
                radius='md'
                m='xs'
            />

            <TextInput
                label='Product number'
                value={code}
                variant='filled'
                readOnly
                icon={<IconCodeAsterix />}
                radius='md'
                m='xs'
            />

            <Group grow m='xs' >

                <NumberInput
                    label='Quantity order'
                    placeholder="Input quantity order"
                    radius='md'
                    icon={<IconClipboardCheck />}
                    min={0}
                    hideControls
                    {...form.getInputProps('ordered')}
                />

                <TextInput
                    label='Quantity shipped'
                    radius='md'
                    icon={<IconTruckDelivery />}
                    readOnly
                    variant='filled'
                    value={delivered}
                />

            </Group>

            <PriceTextInput
                label='Harga / unit'
                placeholder="Input harga per unit"
                {...form.getInputProps('price')}
                m='xs'
                required
            />

        </ModalForm>
    )
}

const ModalAddProductOrder = ({ handleAddProductOrder, salesOrderId, customerId }) => {

    const [productList, setProductList] = useState([])
    const { Retrieve, Post } = useRequest()
    const { successNotif, failedNotif } = useNotification()
    const form = useForm({
        initialValues: {
            ordered: '',
            product: null,
            sales_order: salesOrderId,
            price: ''
        },
    })

    useEffect(() => {
        const fetch = async () => {
            try {
                const products = await Retrieve(customerId, 'product-customer')
                setProductList(products)
            } catch (e) {
                console.log(e)
            }
        }
        fetch()
    }, [customerId])

    const getSelectedProduct = useCallback((id) => {
        return productList.find(product => product.id === parseInt(id))
    }, [productList])

    const handleSubmit = async (value) => {
        const { product } = value
        const selectedProduct = getSelectedProduct(product)

        try {
            const { sales_order, ...rest } = await Post(value, 'product-order-management')
            successNotif('Add product order success')
            handleAddProductOrder({ ...rest, product: selectedProduct })
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Add product order failed')
        }
    }

    return (
        <ModalForm
            id="formAddProductOrder"
            onSubmit={form.onSubmit(handleSubmit)}
        >

            <Select
                label='Product'
                placeholder="Select product"
                m='xs'
                required
                radius='md'
                icon={<IconBarcode />}
                data={productList.map(product => ({ value: product.id, label: product.name, code: product.code }))}
                {...form.getInputProps('product')}
                itemComponent={CustomSelectComponentProduct}
            />

            <NumberInput
                label='Quantity order'
                required
                placeholder="Input quantity order"
                m='xs'
                radius='md'
                hideControls
                icon={<IconClipboardCheck />}
                {...form.getInputProps('ordered')}
            />

            <PriceTextInput
                label='Harga / unit'
                placeholder="Input harga per unit"
                {...form.getInputProps('price')}
                m='xs'
            />

        </ModalForm>
    )
}


const ProductOrderList = ({ productOrderList, salesOrderId, handleAddProductOrder, handleChangeProductOrder, handleDeleteProductOrder, customerId }) => {

    const { Delete } = useRequest()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Product order' })
    const { successNotif, failedNotif } = useNotification()

    const handleDeletePo = useCallback(async (id) => {

        try {
            await Delete(id, 'product-order-management')
            successNotif('Delete product order success')
            handleDeleteProductOrder(id)
        } catch (e) {
            failedNotif(e, 'Delete product order failed')
        }
    }, [handleDeleteProductOrder, successNotif, failedNotif])


    const openModalDeletePo = useCallback((id) => openConfirmDeleteData(() => handleDeletePo(id)),
        [handleDeletePo, openConfirmDeleteData])

    const openModalEditPo = useCallback((data) => openModal({
        title: 'Edit product order',
        radius: 'md',
        size: 'xl',
        children: <ModalEditProductOrder salesOrderId={salesOrderId} handleChangeProductOrder={handleChangeProductOrder} data={data} />

    }), [handleChangeProductOrder, salesOrderId])

    const openModalAddPo = useCallback(() => openModal({
        title: 'Add product order',
        radius: 'md',
        size: 'xl',
        children: <ModalAddProductOrder salesOrderId={salesOrderId} handleAddProductOrder={handleAddProductOrder} customerId={customerId} />

    }), [handleAddProductOrder, customerId, salesOrderId])


    const columnProductOrder = useMemo(() => [
        {
            name: 'Product',
            selector: row => row.product.name,
            style: {
                paddingLeft: 0,
                marginRight: 0,
            }
        },
        {
            name: 'Product number',
            selector: row => row.product.code,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Order / Shipped',
            selector: row => `${row.ordered} / ${row.delivered} Unit`,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: 'Remaining orders',
            selector: row => `${row.ordered > row.delivered ? row.ordered - row.delivered : 0} Unit`,
            style: {
                paddingLeft: 0,
                marginRight: 0
            }
        },
        {
            name: '',
            selector: row =>
                <ButtonEdit
                    onClick={() => openModalEditPo(row)}
                />,
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: -10
            }
        },
        {
            name: '',
            selector: row => <ButtonDelete
                onClick={() => openModalDeletePo(row.id)}
            />,
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: 0
            }
        }
    ], [openModalDeletePo, openModalEditPo])

    return (
        <>

            <HeadSection>
                <ButtonAdd
                    onClick={openModalAddPo}
                >
                    Product order
                </ButtonAdd>
            </HeadSection>


            <BaseTable
                column={columnProductOrder}
                data={productOrderList}
                noData="No product order"
            />

        </>
    )
}

export default ProductOrderList

