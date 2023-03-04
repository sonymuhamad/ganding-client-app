import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useForm } from "@mantine/form"

import { BaseContent } from "../../layout"
import { useRequest, useConfirmDelete, useNotification } from '../../../hooks'
import { SectionManufacuringProcess, SectionDetailProduct, SectionOrderRelated, SectionWarehouseProduct } from "./detail_product_components"

const DetailProduct = () => {

    const { productId } = useParams()
    const { Retrieve, Get, Put, Delete } = useRequest()
    const { successNotif, failedNotif } = useNotification()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Product' })
    const [productType, setProductType] = useState([])
    const [editAccess, setEditAcces] = useState(false)
    const navigate = useNavigate()
    const [processList, setProcessList] = useState([])
    const [productOrderList, setProductOrderList] = useState([])
    const [customer, setCustomer] = useState({
        name: '',
        id: '',
        addredd: '',
        email: '',
        phone: ''
    })

    const [product, setProduct] = useState({
        id: '',
        code: '',
        image: null,
        name: '',
        customer: '',
        process: '',
        weight: '',
        price: 0,
        type: '',
    })
    const form = useForm({
        initialValues: product
    })

    const links = useMemo(() => [
        {
            "label": "Detail product",
            "link": "detail-product",
            "order": 1
        },
        {
            "label": 'Manufacturing process',
            "link": 'process',
            'order': 1
        },
        {
            "label": "Wip and finish good",
            "link": "wip-fg",
            "order": 1
        },
        {
            "label": "Order related",
            "link": "order-related",
            "order": 1
        }
    ], [])

    const breadcrumb = [
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
    ]

    const checkDataProduct = useCallback((value) => {

        // remove one to one relations with depth >= 1
        const { ppic_productorder_related, ...restData } = value
        const dataFormProduct = { ...restData, ppic_process_related: [] }

        if (typeof dataFormProduct.image === 'string') {
            // checking type of image field first, to prevent error from content-type in server
            const { image, ...data } = dataFormProduct
            return data
        }
        const data = dataFormProduct
        return data

    }, [])


    const handleClickEditButton = useCallback(() => {
        setEditAcces(prev => !prev)
        form.setValues(product)
        form.resetDirty()

    }, [product])

    const setData = useCallback((data) => {
        setProduct(data)
        form.setValues(data)
        form.resetDirty()
    }, [])

    const handleEditProduct = useCallback(async (val) => {
        const dataProduct = checkDataProduct(val)

        try {
            const updatedProduct = await Put(val.id, dataProduct, 'products-management', 'multipart/form-data')
            const { ppic_process_related, ...rest } = updatedProduct
            setData(rest)
            setEditAcces(prev => !prev)
            successNotif('Edit product success')
        } catch (e) {
            form.setErrors(e.message.data)
            failedNotif(e, 'Edit product failed')
        }

    }, [checkDataProduct, setData, successNotif, failedNotif])

    const handleDeleteProduct = useCallback(async () => {
        try {
            await Delete(productId, 'products-management')
            successNotif('Delete product success')
            navigate('/home/ppic/product', { replace: true })
        } catch (e) {
            failedNotif(e, 'Delete product failed')
        }
    }, [navigate, productId, successNotif, failedNotif])

    const totalStock = useMemo(() => {
        return processList.reduce((prev, current) => {

            for (const wh of current.warehouseproduct_set) {
                prev += wh.quantity
            }

            return prev

        }, 0)

    }, [processList])

    useEffect(() => {
        const fetch = async () => {
            try {
                const product = await Retrieve(productId, 'products-detail')
                const productType = await Get('type/product')

                const { customer, type, ppic_process_related, ppic_productorder_related, ...rest } = product
                const dataForm = { ...rest, customer: customer.id, type: type.id }

                setProductType(productType)
                setData(dataForm)
                setProcessList(ppic_process_related)
                setProductOrderList(ppic_productorder_related)
                setCustomer(customer)

            } catch (e) {
                console.log(e)
            }
        }

        fetch()

    }, [setData, productId])

    const setAddProcess = useCallback((newProcess) => {
        setProcessList(prev => [...prev, newProcess])
    }, [])

    const setUpdateProcess = useCallback((updatedProcess) => {
        const { id } = updatedProcess
        setProcessList(prev => {
            return prev.map(process => {
                if (process.id === id) {
                    return updatedProcess
                }
                return process
            })
        })

    }, [])

    const setDeleteProcess = useCallback((idDeletedProcess) => {
        setProcessList(prev => prev.filter(process => process.id !== idDeletedProcess))
    }, [])

    const contents = [
        {
            description: '',
            component: <SectionDetailProduct
                handleClickDeleteButton={() => openConfirmDeleteData(handleDeleteProduct)}
                handleClickEditButton={handleClickEditButton}
                handleSubmit={handleEditProduct}
                form={form}
                editAccess={editAccess}
                customerName={customer.name}
                productTypeList={productType}
                totalStock={totalStock}
            />
        },
        {
            description: '',
            component: <SectionManufacuringProcess
                setAddProcess={setAddProcess}
                setDeleteProcess={setDeleteProcess}
                setUpdateProcess={setUpdateProcess}
                processList={processList}
                productId={productId}
            />
        },
        {
            description: '',
            component: <SectionWarehouseProduct
                processList={processList}
            />
        },
        {
            description: '',
            component: <SectionOrderRelated
                productOrderList={productOrderList}
            />
        }
    ]

    return (
        <BaseContent
            links={links}
            breadcrumb={breadcrumb}
            contents={contents}
        />
    )

}

export default DetailProduct
