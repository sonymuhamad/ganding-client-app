
//// List of product order from detail sales order 

import { Button, Group, NumberInput, Select, TextInput, Text } from "@mantine/core";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRequest } from "../../../../hooks";
import { FailedNotif, SuccessNotif } from "../../../notifications";
import { BaseTable } from "../../../tables";

import { closeAllModals, openModal, openConfirmModal } from "@mantine/modals";
import { IconBarcode, IconClipboardCheck, IconCodeAsterix, IconDownload, IconPlus, IconTruckDelivery, IconEdit, IconTrash, IconReceipt2 } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { CustomSelectComponentProduct } from "../../../layout";


const ModalEditProductOrder = ({ salesOrderId, data, handleChangeProductOrder }) => {

    const { product, delivered, ...rest } = data
    const { name, code, id } = product
    const { Put, Loading } = useRequest()

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
            SuccessNotif('Update product order succedd')
            handleChangeProductOrder(updatedPo)
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
                return
            }
            FailedNotif('Update product order failed')
        }
    }


    return (
        <form onSubmit={form.onSubmit(handleSubmit)} >

            <Loading />

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


            <NumberInput
                label='Harga / unit'
                placeholder="Input harga per unit"
                {...form.getInputProps('price')}
                radius='md'
                hideControls
                m='xs'
                required
                min={0}
                parser={(value) => value.replace(/Rp\s?|(,*)/g, '')}
                formatter={(value) =>
                    !Number.isNaN(parseFloat(value))
                        ? `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : 'Rp '
                }
                icon={<IconReceipt2 />}
            />

            <Button
                my='md'
                type='submit'
                leftIcon={<IconDownload />}
                radius='md'
                fullWidth
            >
                Save
            </Button>

        </form>
    )
}

const ModalAddProductOrder = ({ handleAddProductOrder, salesOrderId, customerId }) => {

    const [productList, setProductList] = useState([])
    const { Retrieve, Loading, Post } = useRequest()
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
            SuccessNotif('Add product order success')
            handleAddProductOrder({ ...rest, product: selectedProduct })
            closeAllModals()
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            if (e.message.data.non_field_errors) {
                FailedNotif(e.message.data.non_field_errors)
                return
            }
            FailedNotif('Add product order failed')
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}  >

            <Loading />

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


            <NumberInput
                label='Harga / unit'
                placeholder="Input harga per unit"
                {...form.getInputProps('price')}
                radius='md'
                m='xs'
                hideControls
                min={0}
                rightSection={<IconReceipt2 />}
                parser={(value) => value.replace(/Rp\s?|(,*)/g, '')}
                formatter={(value) =>
                    !Number.isNaN(parseFloat(value))
                        ? `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : 'Rp '
                }
                icon={<IconReceipt2 />}
            />

            <Button
                my='md'
                radius='md'
                fullWidth
                leftIcon={<IconDownload />}
                type='submit'
            >
                Save
            </Button>

        </form>
    )
}


const ProductOrderList = ({ productOrderList, salesOrderId, handleAddProductOrder, handleChangeProductOrder, handleDeleteProductOrder, customerId }) => {

    const { Delete } = useRequest()

    const handleDeletePo = useCallback(async (id) => {

        try {
            await Delete(id, 'product-order-management')
            SuccessNotif('Delete product order success')
            handleDeleteProductOrder(id)
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Delete product order failed')
        }
    }, [handleDeleteProductOrder])


    const openModalDeletePo = useCallback((id) => openConfirmModal({
        title: `Delete Product Order`,
        children: (
            <Text size="sm">
                Are you sure?, data will be deleted.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeletePo(id),
    }), [handleDeletePo])

    const openModalEditPo = useCallback((data) => openModal({
        title: 'Edit product order',
        radius: 'md',
        size: 'xl',
        children: <ModalEditProductOrder salesOrderId={salesOrderId} handleChangeProductOrder={handleChangeProductOrder} data={data} />

    }), [handleChangeProductOrder, , salesOrderId])

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
                <Button
                    leftIcon={<IconEdit stroke={2} size={16} />}
                    color='blue.6'
                    variant='subtle'
                    radius='md'
                    mx='xs'
                    onClick={() => openModalEditPo(row)}
                >
                    Edit
                </Button>,
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: -10
            }
        },
        {
            name: '',
            selector: row => <Button
                leftIcon={<IconTrash stroke={2} size={16} />}
                color='red.6'
                variant='subtle'
                radius='md'
                onClick={() => openModalDeletePo(row.id)}
            >
                Delete
            </Button>,
            style: {
                paddingLeft: 0,
                marginLeft: -30,
                marginRight: 0
            }
        }
    ], [openModalDeletePo, openModalEditPo])

    return (
        <>

            <Group
                m='xs'
                position="right"
            >
                <Button
                    leftIcon={<IconPlus />}
                    radius='md'
                    variant='outline'
                    onClick={openModalAddPo}
                >
                    Product order
                </Button>

            </Group>

            <BaseTable
                column={columnProductOrder}
                data={productOrderList}
                noData="No product order"
            />

        </>
    )
}

export default ProductOrderList

