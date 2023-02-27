import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";

import { useRequest, useConfirmDelete } from "../../../hooks";
import { BaseContent } from "../../layout";
import { SuccessNotif, FailedNotif } from "../../notifications"
import { SectionProductShipped, SectionDetailDeliveryNoteSubcont } from "./detail_delivery_note_subcont_components";
import { generateDataWithNote, generateDataWithDate } from "../../../services";
import { openModal } from "@mantine/modals";

import { DeliveryNoteSubcontReport } from "../../outputs/";

const DetailDeliveryNoteSubcont = () => {

    const { deliveryNoteSubcontId } = useParams()
    const { Get, Retrieve, Put, Delete } = useRequest()
    const navigate = useNavigate()
    const { openConfirmDeleteData } = useConfirmDelete({ entity: 'Delivery note subcont' })
    const [editAccess, setEditAccess] = useState(false)
    const [driverList, setDriverList] = useState([])
    const [vehicleList, setVehicleList] = useState([])
    const [productSubconts, setProductSubcont] = useState([])
    const [dataSupplier, setDataSupplier] = useState({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: '',
    })
    const [data, setData] = useState({
        id: '',
        code: '',
        created: '',
        note: '',
        driver: null,
        vehicle: null,
        supplier: '',
        date: ''
    })

    const form = useForm({
        initialValues: data
    })

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
            path: `/home/ppic/delivery/subcont/${deliveryNoteSubcontId}`,
            label: 'Detail delivery subconstruction'
        }
    ], [deliveryNoteSubcontId])

    const links = [
        {
            "label": 'Detail delivery subconstruction',
            "link": 'detail',
            'order': 1
        },
        {
            "label": "Products shipped",
            "link": "product-shipped",
            "order": 1
        },
    ]


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
        children: <DeliveryNoteSubcontReport
            data={data}
            vehicleNumber={selectedVehicle}
            driverName={selectedDriver}
            supplier={dataSupplier}
            productDeliveryList={productSubconts}
        />
    }), [data, selectedDriver, selectedVehicle])

    const setDataForForm = useCallback((dataForm) => {
        setData(dataForm)
        form.setValues(dataForm)
        form.resetDirty()
    }, [])

    const setDataAfterUpdate = useCallback((updatedData) => {
        const { date, ...rest } = updatedData
        setDataForForm({ ...rest, date: new Date(date) })
    }, [setDataForForm])

    const handleSubmit = useCallback(async (value) => {
        const generatedDataWithNote = generateDataWithNote(value)
        const { date, ...rest } = generatedDataWithNote
        const validated_data = generateDataWithDate(date, rest)

        try {
            const updatedData = await Put(deliveryNoteSubcontId, validated_data, 'delivery-note-subcont-management')
            setDataAfterUpdate(updatedData)
            SuccessNotif('Edit delivery note success')
            setEditAccess(prev => !prev)
        } catch (e) {
            form.setErrors(e.message.data)
            FailedNotif('Edit delivery note failed')
        }

    }, [deliveryNoteSubcontId, setDataAfterUpdate])

    const handleDeleteDeliveryNote = useCallback(async () => {
        try {
            await Delete(deliveryNoteSubcontId, 'delivery-note-subcont-management')
            navigate('/home/ppic/delivery')
            SuccessNotif('Delete delivery note success')
        } catch (e) {
            if (e.message.data.constructor === Array) {
                FailedNotif(e.message.data)
            }
        }
    }, [navigate, deliveryNoteSubcontId])

    const handleClickEditAccess = useCallback(() => {
        form.setValues(data)
        form.resetDirty()
        setEditAccess(prev => !prev)
    }, [data])


    const setDataDetailDeliveryNote = useCallback((data) => {
        const { supplier, driver, date, vehicle, productdeliversubcont_set, ...restProps } = data
        const detailSubcont = { ...restProps, supplier: supplier.id, driver: driver.id, vehicle: vehicle.id, date: new Date(date) }

        setDataForForm(detailSubcont)
        setDataSupplier(supplier)
        setProductSubcont(productdeliversubcont_set)

    }, [setDataForForm])

    const fetch = useCallback(async () => {

        try {
            const detailDeliveryNoteSubcont = await Retrieve(deliveryNoteSubcontId, 'delivery-note-subcont')
            const driverList = await Get('driver')
            const vehcileList = await Get('vehicle')

            setDriverList(driverList)
            setVehicleList(vehcileList)
            setDataDetailDeliveryNote(detailDeliveryNoteSubcont)

        } catch (e) {
            console.log(e)
        }

    }, [deliveryNoteSubcontId, setDataDetailDeliveryNote])


    useEffect(() => {
        fetch()
    }, [fetch])

    const setAddProductShipped = useCallback((newProductShipped) => {
        setProductSubcont(prev => [...prev, newProductShipped])
    }, [])

    const setUpdateProductShipped = useCallback((updatedProductShipped) => {
        const { id, quantity, description } = updatedProductShipped

        setProductSubcont(prev => prev.map(productShipped => {
            if (productShipped.id === id) {
                return { ...productShipped, quantity: quantity, description: description }
            }
            return productShipped
        }))

    }, [])

    const setDeleteProductShipped = useCallback((idDeletedProductShipped) => {

        setProductSubcont(prev => prev.filter(productShipped => productShipped.id !== idDeletedProductShipped))

    }, [])

    const contents = [
        {
            description: '',
            component: <SectionDetailDeliveryNoteSubcont
                handleClickDeleteButton={() => openConfirmDeleteData(handleDeleteDeliveryNote)}
                handleClickEditButton={handleClickEditAccess}
                supplierName={dataSupplier.name}
                handleSubmit={handleSubmit}
                driverList={driverList}
                vehicleList={vehicleList}
                form={form}
                editAccess={editAccess}
                openModalPrintDeliveryNote={openModalPrintDeliveryNote}
            />
        },
        {
            description: '',
            component: <SectionProductShipped
                setAddProductShipped={setAddProductShipped}
                setUpdateProductShipped={setUpdateProductShipped}
                setDeleteProductShipped={setDeleteProductShipped}
                productSubcontList={productSubconts}
                deliveryNoteSubcontId={deliveryNoteSubcontId}
            />
        }
    ]


    return (
        <BaseContent
            contents={contents}
            links={links}
            breadcrumb={breadcrumb}
        />
    )
}

export default DetailDeliveryNoteSubcont
