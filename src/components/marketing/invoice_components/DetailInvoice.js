import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";


import { useRequest } from "../../../hooks";
import { BaseContent } from "../../layout";
import { DetailComponentInvoice, ProductInvoiceList } from "./detail_invoice_components";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { openConfirmModal } from "@mantine/modals";

import { Text } from "@mantine/core";


const DetailInvoice = () => {

    const { invoiceId } = useParams()
    const { Retrieve, Loading, Put, Delete } = useRequest()
    const navigate = useNavigate()
    const [editAccess, setEditAccess] = useState(false)
    const [productInvoiceList, setProductInvoiceList] = useState([])
    const baseData = useMemo(() => ({
        id: '',
        code: '',
        date: '',
        discount: 0,
        tax: 10,
        closed: false,
        done: false,
    }), [])

    const [detailInvoice, setDetailInvoice] = useState({
        ...baseData
    })
    const form = useForm({
        initialValues: {
            ...baseData
        }
    })

    const [salesOrder, setSalesOrder] = useState({
        id: '',
        code: '',
        date: '',
    })

    const [customer, setCustomer] = useState({
        id: '',
        name: '',
        address: '',
    })

    const getSubTotal = useCallback(() => {

        const subTotal = productInvoiceList.reduce((prev, current) => {
            const { price, ordered } = current
            const totalCurrentPrice = price * ordered

            return prev + totalCurrentPrice
        }, 0)

        return subTotal

    }, [productInvoiceList])

    const getTotalDiscount = useCallback((subTotal, discount) => {
        const discountPrice = (discount / 100) * subTotal
        const totalPriceAfterDiscount = subTotal - discountPrice

        return [totalPriceAfterDiscount, discountPrice]

    }, [])

    const getTotalInvoice = useCallback((priceAfterDiscount, tax) => {
        const taxPrice = (tax / 100) * priceAfterDiscount
        const totalInvoice = priceAfterDiscount - taxPrice

        return [totalInvoice, taxPrice]
    }, [])

    const priceCalculation = useMemo(() => {

        const { tax, discount } = detailInvoice

        const subTotal = getSubTotal()
        const [totalPriceAfterDiscount, discountPrice] = getTotalDiscount(subTotal, discount)
        const [totalInvoice, taxPrice] = getTotalInvoice(totalPriceAfterDiscount, tax)

        const data = {
            subTotal: subTotal,
            totalDiscount: discountPrice,
            totalPriceAfterDiscount: totalPriceAfterDiscount,
            totalTax: taxPrice,
            totalInvoice: totalInvoice
        }

        return data

    }, [getSubTotal, detailInvoice, getTotalDiscount, getTotalInvoice])

    const currentStatusInvoice = useMemo(() => {
        const { done, closed } = detailInvoice

        if (closed) {
            return 'closed'
        }

        if (done) {
            return 'done'
        }

        return 'pending'

    }, [detailInvoice])

    const setDataForm = useCallback((data) => {
        if (data) {
            form.setValues(data)
            form.resetDirty()
            return
        }
    }, [])

    const handleClickEditButton = useCallback(() => {

        setEditAccess(prev => !prev)
        setDataForm(detailInvoice)

    }, [setDataForm, detailInvoice])

    const handleSetDataInvoice = useCallback((data) => {
        data.date = new Date(data.date)
        setDetailInvoice(data)
        setDataForm(data)

    }, [setDataForm])



    useEffect(() => {

        Retrieve(invoiceId, 'invoice').then(data => {

            const { sales_order, ...rest } = data
            const { customer, productorder_set } = sales_order
            setSalesOrder(sales_order)
            setCustomer(customer)
            handleSetDataInvoice(rest)
            setProductInvoiceList(productorder_set)

        })

    }, [handleSetDataInvoice])

    const handleChangeDataInvoice = useCallback((changedInvoice) => {
        const { sales_order, ...rest } = changedInvoice
        handleSetDataInvoice(rest)
    }, [handleSetDataInvoice])

    const generateDate = useCallback((date, data) => {
        const { id } = salesOrder
        data.sales_order = id
        if (date) {
            return { ...data, date: date.toLocaleDateString('en-CA') }
        }
        return data
    }, [salesOrder])


    const handleSubmit = async (value) => {
        const { date, ...rest } = value
        const validate_data = generateDate(date, rest)

        try {
            const changedInvoice = await Put(invoiceId, validate_data, 'invoice-management')
            handleChangeDataInvoice(changedInvoice)
            SuccessNotif('Edit invoice success')
            setEditAccess(prev => !prev)
        } catch (e) {
            form.setErrors(e.message.data)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Edit invoice failed')
        }
    }

    const generateInputStatus = useCallback((newStatus) => {

        const data = { ...detailInvoice }

        if (newStatus === 'closed') {
            data.closed = true
            return data
        }

        if (newStatus === 'done') {
            data.done = true
            return data
        }

        data.done = false
        return data

    }, [detailInvoice])

    const handleChangeStatus = useCallback(async (value) => {
        const dataAfterGenerateStatus = generateInputStatus(value)
        const { date, ...rest } = dataAfterGenerateStatus
        const validate_data = generateDate(date, rest)

        try {
            const changedInvoice = await Put(invoiceId, validate_data, 'invoice-management')
            handleChangeDataInvoice(changedInvoice)
            SuccessNotif('Update status invoice success')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Update status invoice failed')
        }
    }, [generateInputStatus, generateDate])


    const openConfirmChangeStatusInvoice = useCallback((value) => openConfirmModal({
        title: `Change status of invoice`,
        children: (
            <Text size="sm">
                {value === 'closed' ? 'Anda akan mengubah status invoice menjadi Closed, aksi ini akan membuat invoice tidak bisa lagi diubah, Apakah anda yakin? perubahan status akan disimpan' : value === 'done' ? 'Anda akan mengubah status invoice menjadi Finished, Apakah anda yakin? perubahan status akan disimpan' : 'Anda akan mengubah status invoice menjadi Pending, Apakah anda yakin? perubahan status akan disimpan'}
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, change', cancel: "No, don't change it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleChangeStatus(value),
    }), [handleChangeStatus])

    const handleDeleteInvoice = useCallback(async () => {
        try {
            await Delete(invoiceId, 'invoice-management')
            SuccessNotif('Delete invoice success')
            navigate('/home/marketing/invoice')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Delete invoice failed')
        }
    }, [])

    const openConfirmDeleteInvoice = useCallback(() => openConfirmModal({
        title: `Delete invoice`,
        children: (
            <Text size="sm">
                Are you sure? the data will be deleted and cannot be recovered.
            </Text>
        ),
        radius: 'md',
        labels: { confirm: 'Yes, delete', cancel: "No, don't delete it" },
        cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
        confirmProps: { radius: 'md' },
        onConfirm: () => handleDeleteInvoice(),
    }), [handleDeleteInvoice])

    const contents = [
        {
            description: '',
            component: <DetailComponentInvoice
                customer={customer}
                salesOrder={salesOrder}
                handleClickEditButton={handleClickEditButton}
                editAccess={editAccess}
                currentStatusInvoice={currentStatusInvoice}
                handleDeleteInvoice={openConfirmDeleteInvoice}
                handleSubmit={handleSubmit}
                handleChangeStatus={openConfirmChangeStatusInvoice}
                form={form}
                priceCalculation={priceCalculation}
                detailInvoice={detailInvoice}
                productInvoiceList={productInvoiceList}
            />
        },
        {
            description: '',
            component: <ProductInvoiceList
                data={productInvoiceList}
            />
        }
    ]

    const breadcrumb = useMemo(() => [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/invoice',
            label: 'Invoice'
        },
        {
            path: `/home/marketing/invoice/${invoiceId}`,
            label: 'Detail invoice'
        }
    ], [])


    const links = useMemo(() => [
        {
            "label": "Detail invoice",
            "link": "detail",
            "order": 1
        },
        {
            "label": "Products",
            "link": "products",
            "order": 1
        },
    ], [])


    return (
        <>

            <Loading />

            <BaseContent
                links={links}
                contents={contents}
                breadcrumb={breadcrumb}
            />

        </>
    )
}

export default DetailInvoice