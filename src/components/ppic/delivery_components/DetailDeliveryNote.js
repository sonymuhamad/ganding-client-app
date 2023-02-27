import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { SuccessNotif, FailedNotif } from "../../notifications";
import { BaseContent } from '../../layout'
import { useRequest, useConfirmDelete } from "../../../hooks";

import { useForm } from "@mantine/form";
import { openModal } from "@mantine/modals";
import { DeliveryNoteReport } from "../../outputs";
import { generateDataWithDate, generateDataWithNote } from "../../../services";
import { SectionProductShipped, SectionDetailDeliveryNote } from "./detail_delivery_note_customer_components";


const DetailDeliveryNote = () => {

    const { deliveryNoteId } = useParams()
    const { Retrieve, Put, Get, Delete } = useRequest()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Delivery note' })
    const navigate = useNavigate()

    const [editAccess, setEditAccess] = useState(false)
    const [driverList, setDriverList] = useState([])
    const [vehicleList, setVehicleList] = useState([])
    const [productShippedList, setProductShippedList] = useState([])
    const [customer, setCustomer] = useState({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: ''
    })
    const [data, setData] = useState({
        id: '',
        code: '',
        note: '',
        driver: null,
        vehicle: null,
        created: '',
        last_update: '',
        date: '',
        customer: '',
    })


    const form = useForm({
        initialValues: data
    })


    const links = [
        {
            "label": 'Detail delivery note',
            "link": 'detail',
            'order': 1
        },
        {
            "label": "Products shipped",
            "link": "product-shipped",
            "order": 1
        },
    ]

    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/delivery',
            label: 'Delivery'
        },
        {
            path: `/home/ppic/delivery/${deliveryNoteId}`,
            label: 'Detail delivery note'
        }
    ], [deliveryNoteId])

    const [selectedVehicle, selectedDriver] = useMemo(() => {

        const { vehicle, driver } = form.values
        let vehicleNumber = ''
        let driverName = ''

        if (vehicle) {
            const onSelectedVehicle = vehicleList.find(eachVehicle => eachVehicle.id === parseInt(vehicle))
            if (onSelectedVehicle) {
                const { license_part_number } = onSelectedVehicle
                vehicleNumber = license_part_number
            }
        }

        if (driver) {
            const onSelectedDriver = driverList.find(eachDriver => eachDriver.id === parseInt(driver))
            if (onSelectedDriver) {
                const { name } = onSelectedDriver
                driverName = name
            }
        }
        return [vehicleNumber, driverName]
    }, [form.values, vehicleList, driverList])

    const openModalPrintDeliveryNote = useCallback(() => openModal({
        size: 'auto',
        radius: 'md',
        children: <DeliveryNoteReport
            data={data}
            vehicleNumber={selectedVehicle}
            driverName={selectedDriver}
            customer={customer}
            productDeliveryList={productShippedList}
        />
    }), [data, selectedDriver, selectedVehicle])

    const handleClickEditButton = useCallback(() => {
        if (editAccess === true) {
            form.setValues(data)
            form.resetDirty()
        }
        setEditAccess(prev => !prev)

    }, [editAccess, data])

    const handleDeleteDeliveryNote = useCallback(async () => {
        try {
            await Delete(deliveryNoteId, 'delivery-note-management')
            navigate('/home/ppic/delivery')
            SuccessNotif('Delete delivery note success')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [navigate, deliveryNoteId])

    const setDataForm = useCallback((data) => {
        form.setValues(data)
        form.resetDirty()
    }, [])

    const handleSetAfterUpdateData = useCallback((updatedData) => {
        const { date, ...rest } = updatedData
        setDataForm({ ...rest, date: new Date(date) })
    }, [setDataForm])

    const handleSubmit = useCallback(async (value) => {

        const generatedDataFromDataWithNote = generateDataWithNote(value)
        const { date, ...rest } = generatedDataFromDataWithNote
        const validated_data = generateDataWithDate(date, rest)

        try {
            const updatedData = await Put(deliveryNoteId, validated_data, 'delivery-note-management')
            handleSetAfterUpdateData(updatedData)
            SuccessNotif('Edit delivery note success')
            setEditAccess(prev => !prev)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit delivery note failed')
            console.log(e)

        }

    }, [handleSetAfterUpdateData, deliveryNoteId])

    const setDataDetailDeliveryNote = useCallback((detailDeliveryNote) => {
        const { date, customer, productdelivercustomer_set, driver, vehicle, ...restProps } = detailDeliveryNote
        const dataForForm = { ...restProps, date: new Date(date), customer: customer.id, vehicle: vehicle.id, driver: driver.id }

        setData(dataForForm)
        setCustomer(customer)
        setProductShippedList(productdelivercustomer_set)
        setDataForm(dataForForm)

    }, [setDataForm])

    const fetch = useCallback(async () => {
        try {
            const detailDeliveryNote = await Retrieve(deliveryNoteId, 'delivery-note')
            const driverList = await Get('driver')
            const vehicleList = await Get('vehicle')
            setDriverList(driverList)
            setVehicleList(vehicleList)

            return setDataDetailDeliveryNote(detailDeliveryNote)

        } catch (e) {
            console.log(e)
        }

    }, [deliveryNoteId, setDataDetailDeliveryNote])

    useEffect(() => {
        fetch()
    }, [fetch])

    const handleAddProductShipped = useCallback((newProductShipped) => {
        setProductShippedList(prev => {
            return [...prev, newProductShipped]
        })
    }, [])

    const handleEditProductShipped = useCallback((updatedProductShipped) => {
        const { id, quantity, description } = updatedProductShipped

        setProductShippedList(prev => prev.map((eachProductShipped) => {
            if (eachProductShipped.id === id) {
                return { ...eachProductShipped, quantity: quantity, description: description }
            }
            return eachProductShipped
        }))

    }, [])

    const handleDeleteProductShipped = useCallback((idDeletedProductShipped) => {
        setProductShippedList(prev => prev.filter(eachProductShipped => eachProductShipped.id !== idDeletedProductShipped))

    }, [])

    const contents = [
        {
            description: '',
            component: <SectionDetailDeliveryNote
                customerName={customer.name}
                handleClickEditButton={handleClickEditButton}
                handleSubmit={handleSubmit}
                handleClickDeleteButton={() => openConfirmDeleteData(handleDeleteDeliveryNote)}
                openModalPrintDeliveryNote={openModalPrintDeliveryNote}
                editAccess={editAccess}
                form={form}
                vehicleList={vehicleList}
                driverList={driverList}
            />
        },
        {
            description: '',
            component: <SectionProductShipped
                idDeliveryNote={data.id}
                setAddProductShipped={handleAddProductShipped}
                setDeleteProductShipped={handleDeleteProductShipped}
                setEditProductShipped={handleEditProductShipped}
                productShippedList={productShippedList}
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

export default DetailDeliveryNote


