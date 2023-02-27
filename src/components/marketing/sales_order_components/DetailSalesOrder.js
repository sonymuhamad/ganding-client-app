import React, { useState, useEffect, useCallback, useMemo } from "react";

import { useParams } from "react-router-dom";
import { useRequest, useConfirmDelete } from "../../../hooks"
import { Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FailedNotif, SuccessNotif } from "../../notifications";
import { openConfirmModal } from "@mantine/modals";
import { useNavigate } from "react-router-dom";
import { ProductOrderList, DeliveryScheduleList, ComponentDetailSalesOrder, ReportDelivery } from "./detail_sales_order_components";
import { BaseContent } from "../../layout";
import { generateDataWithDate, generateDataWithDescription } from "../../../services";



const DetailSalesOrder = () => {

    const { salesOrderId } = useParams() // salesOrderId
    const navigate = useNavigate()
    const { Retrieve, Delete, Put } = useRequest()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Sales order' })

    const [salesOrder, setSalesOrder] = useState({
        id: '',
        code: '',
        date: '',
        description: '',
    })
    const [customer, setCustomer] = useState({
        id: '',
        name: '',
        address: '',
        email: '',
        phone: ''
    })
    const [productOrderList, setProductOrderList] = useState([])
    const [quantityProductOrdered, setProductOrdered] = useState(0)
    const [quantityProductDelivered, setProductDelivered] = useState(0)
    const [fixed, setFixed] = useState(false)
    const [closed, setClosed] = useState(false)
    const [deliveryScheduleList, setDeliveryScheduleList] = useState([])
    const [productDeliverList, setProductDeliverList] = useState([])
    const [editAccess, setEditAccess] = useState(false)

    const percentage = useMemo(() => {
        if (quantityProductOrdered === 0) {
            return 100
        }
        return Math.round(((quantityProductDelivered / quantityProductOrdered) * 100) * 10) / 10
    }, [quantityProductOrdered, quantityProductDelivered])

    const currentStatusSalesOrder = useMemo(() => {
        if (closed) {
            return 'closed'
        }
        if (fixed) {
            if (quantityProductDelivered >= quantityProductOrdered) {
                return 'finished'
            }
            return 'progress'
        }

        return 'pending'
    }, [fixed, closed, quantityProductDelivered, quantityProductOrdered])

    const form = useForm(
        {
            initialValues: {
                id: '',
                code: '',
                date: '',
                description: '',
            }
        }
    )

    const links = [
        {
            "label": "Detail sales order",
            "link": "sales-order",
            "order": 1
        },
        {
            "label": "Ordered products",
            "link": "product-order",
            "order": 1
        },
        {
            "label": "Delivery schedule",
            "link": "delivery-schedule",
            "order": 1
        },
        {
            "label": "Report delivery",
            "link": "report-delivery",
            "order": 1
        }
    ]

    const breadcrumb = [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/sales-order',
            label: 'Sales order'
        },
        {
            path: `/home/marketing/sales-order/${salesOrderId}`,
            label: 'Detail'
        }
    ]

    const setDataForm = useCallback((data) => {
        form.setValues(data)
        form.resetDirty()
    }, [form])

    const handleClickEditButton = useCallback((data = salesOrder) => {
        setEditAccess(prev => !prev)
        setDataForm(data)
    }, [setDataForm, salesOrder])


    const changedDataSalesOrderAfterEdit = useCallback((data) => {
        //changing data sales order after edit

        setSalesOrder(prev => {
            const { code, date, description, fixed, closed } = data
            const newData = { ...prev, code: code, date: new Date(date), description: description }

            setFixed(fixed)
            setClosed(closed)
            setDataForm(newData)
            return newData
        })

    }, [setDataForm])

    const generateDataBeforeUpdate = useCallback((data) => {
        const { date, ...rest } = data
        const { id } = customer

        let validate_data = { ...rest, customer: id, fixed: fixed, closed: closed }
        const validated_data = generateDataWithDate(date, validate_data)

        return generateDataWithDescription(validated_data)

    }, [customer, fixed, closed])

    const handleEditSo = useCallback(async (value) => {

        const validate_data = generateDataBeforeUpdate(value)
        console.log(validate_data)
        try {
            const updatedDataSalesOrder = await Put(salesOrderId, validate_data, 'sales-order-management')
            SuccessNotif('Sales order has been updated')
            changedDataSalesOrderAfterEdit(updatedDataSalesOrder)
            setEditAccess(prev => !prev)
        } catch (e) {
            form.setErrors({ ...e.message.data })
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Edit sales order failed')
        }
    }, [salesOrderId, changedDataSalesOrderAfterEdit, generateDataBeforeUpdate])

    const generateStatus = useCallback((status) => {
        // generate data before changing status of sales order

        const { date, ...rest } = salesOrder
        const validate_data = generateDataWithDate(date, rest)

        const { id } = customer
        const data = { ...validate_data, customer: id, fixed: fixed, closed: closed }

        if (status === 'closed') {
            data.closed = true
            return data
        }

        if (status === 'progress') {
            data.fixed = true
            return data
        }

        data.fixed = false
        return data

    }, [salesOrder, customer, fixed, closed])

    const handleChangeStatus = useCallback(async (status) => {
        const data = generateStatus(status)

        try {
            const newData = await Put(salesOrderId, data, 'sales-order-management')
            SuccessNotif('Status updated')
            changedDataSalesOrderAfterEdit(newData)
        } catch (e) {
            console.log(e)
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
                return
            }
            FailedNotif('Update status failed')
        }

    }, [changedDataSalesOrderAfterEdit, generateStatus, salesOrderId])

    const getWarningMessage = useCallback((value) => {
        // return a warning message while changing status of sales order

        if (value === 'closed') {
            return 'Anda akan mengubah status sales order menjadi Closed, aksi ini akan membuat sales order tidak bisa lagi diubah, Apakah anda yakin? perubahan status akan disimpan'
        }
        if (value === 'progress') {
            return 'Anda akan mengubah status sales order menjadi Progress, Apakah anda yakin? perubahan status akan disimpan'
        }

        return 'Anda akan mengubah status sales order menjadi Pending, Apakah anda yakin? perubahan status akan disimpan'
    }, [])

    const openConfirmStatusChanged = useCallback((value) => {

        const message = getWarningMessage(value)

        return openConfirmModal({
            title: `Change status of sales order`,
            children: (
                <Text size="sm">
                    {message}
                </Text>
            ),
            radius: 'md',
            labels: { confirm: 'Yes, change', cancel: "No, don't change it" },
            cancelProps: { color: 'red', variant: 'filled', radius: 'md' },
            confirmProps: { radius: 'md' },
            onConfirm: () => handleChangeStatus(value),
        })
    }, [handleChangeStatus, getWarningMessage])

    const handleDeleteSo = useCallback(async () => {
        try {
            await Delete(salesOrderId, 'sales-order-management')
            SuccessNotif('Sales order has been deleted')
            navigate('/home/marketing/sales-order')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }

    }, [salesOrderId, navigate])


    const handleClickDeleteButton = () => openConfirmDeleteData(handleDeleteSo)

    useEffect(() => {
        const fetch = async () => {

            try {
                const salesorder = await Retrieve(salesOrderId, 'sales-order-list')
                const deliveryScheduleList = await Retrieve(salesOrderId, 'delivery-schedule')
                const productDeliverList = await Retrieve(salesOrderId, 'product-delivery')

                const { customer, date, productordered, fixed, closed, productdelivered, productorder_set, ...rest } = salesorder

                const data = { ...rest, date: new Date(date) }



                form.setValues(data)
                form.resetDirty()
                setSalesOrder(data)

                setCustomer(customer)
                setProductDelivered(productdelivered)
                setProductOrdered(productordered)
                setProductOrderList(productorder_set)
                setFixed(fixed)
                setClosed(closed)
                setDeliveryScheduleList(deliveryScheduleList)
                setProductDeliverList(productDeliverList)


            } catch (e) {
                console.log(e)
            }

        }
        fetch()

    }, [salesOrderId])

    const handleAddProductOrder = useCallback((newProductOrder) => {
        // add product order to state

        setProductOrderList(prev => {
            return [...prev, newProductOrder]
        })

    }, [])

    const handleChangeProductOrder = useCallback((updatedProductOrder) => {
        // change ordered or price of product order

        const { ordered, price, id } = updatedProductOrder
        setProductOrderList(prev => {

            return prev.map(po => {
                if (po.id === id) {
                    return { ...po, ordered: ordered, price: price }
                }
                return po
            })

        })

    }, [])

    const handleDeleteProductOrder = useCallback((idDeletedPo) => {
        // delete product order

        setProductOrderList(prev => {
            return prev.filter(po => po.id !== idDeletedPo)
        })

    }, [])

    const handleDeleteDeliverySchedule = useCallback((idDeletedDeliverySchedule) => {

        setDeliveryScheduleList(prev => {
            return prev.filter(schedule => schedule.id !== idDeletedDeliverySchedule)
        })

    }, [])


    const handleAddDeliverySchedule = useCallback((newSchedule) => {

        setDeliveryScheduleList(prev => {
            return [...prev, newSchedule]
        })

    }, [])

    const handleChangeDeliverySchedule = useCallback((changedDeliverySchedule) => {

        const { quantity, date, id } = changedDeliverySchedule
        setDeliveryScheduleList(prev => {

            return prev.map(schedule => {

                if (schedule.id === id) {
                    return { ...schedule, quantity: quantity, date: date }
                }
                return schedule

            })

        })

    }, [])



    const contents = [
        {
            description: '',
            component: <ComponentDetailSalesOrder
                form={form}
                handleClickDeleteButton={handleClickDeleteButton}
                handleEditSo={handleEditSo}
                customerName={customer.name}
                percentage={percentage}
                handleChangeStatus={openConfirmStatusChanged}
                status={currentStatusSalesOrder}
                editAccess={editAccess}
                handleClickEditButton={handleClickEditButton}
                productOrderList={productOrderList}
                noSalesOrder={salesOrder.code}
                salesOrderDate={salesOrder.date}
            />
        },
        {
            description: '',
            component: <ProductOrderList
                productOrderList={productOrderList}
                handleAddProductOrder={handleAddProductOrder}
                handleChangeProductOrder={handleChangeProductOrder}
                handleDeleteProductOrder={handleDeleteProductOrder}
                customerId={customer.id}
                salesOrderId={salesOrderId}
            />
        },
        {
            description: '',
            component: <DeliveryScheduleList
                data={deliveryScheduleList}
                productOrderList={productOrderList}
                handleChangeDeliverySchedule={handleChangeDeliverySchedule}
                handleAddDeliverySchedule={handleAddDeliverySchedule}
                handleDeleteDeliverySchedule={handleDeleteDeliverySchedule}
            />
        },
        {
            description: '',
            component: <ReportDelivery
                data={productDeliverList}
                customerName={customer.name}
                productOrderList={productOrderList}
                noSalesOrder={salesOrder.code}
                salesOrderDate={salesOrder.date}
            />
        }
    ]

    return (
        <>



            <BaseContent
                links={links}
                contents={contents}
                breadcrumb={breadcrumb}
            />

        </>
    )

}


export default DetailSalesOrder

