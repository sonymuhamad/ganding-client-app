import React, { useEffect, useState, useMemo } from "react"

import { useParams } from "react-router-dom"
import { useRequest, } from "../../../hooks"

import { BaseContent } from "../../layout"
import { SectionDetailDeliveryNoteSubcont, SectionProductDeliverySubcont } from "./detail_delivery_note_subcont_components"


const DetailDeliveryNoteSubcont = () => {

    const { Retrieve } = useRequest()
    const { deliverySubcontId } = useParams()
    const [productSubcontList, setProductSubcontList] = useState([])
    const [driver, setDriver] = useState({
        name: '',
        id: '',
    })
    const [supplier, setSupplier] = useState({
        id: '',
        name: '',
        phone: '',
        address: '',
        email: '',
    })
    const [vehicle, setVehicle] = useState({
        id: '',
        license_part_number: ''
    })
    const [detailDeliveryNoteSubcont, setDetailDeliveryNoteSubcont] = useState({
        id: '',
        code: '',
        created: '',
        note: '',
        last_update: '',
        date: '',
    })


    useEffect(() => {

        Retrieve(deliverySubcontId, 'delivery-note-subcont').then(data => {

            const { supplier, driver, vehicle, productdeliversubcont_set, ...rest } = data

            setSupplier(supplier)
            setDriver(driver)
            setVehicle(vehicle)
            setProductSubcontList(productdeliversubcont_set)
            setDetailDeliveryNoteSubcont(rest)

        })

    }, [deliverySubcontId])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/purchasing',
            label: 'Purchasing'
        },
        {
            path: '/home/purchasing/shipments-and-receipts',
            label: 'Shipments and receipts'
        },
        {
            path: `/home/purchasing/shipments-and-receipts/shipment-subcont/${deliverySubcontId}`,
            label: 'Detail delivery subconstruction'
        },
    ], [deliverySubcontId])


    const links = useMemo(() => [
        {
            "label": "Detail delivery subconstruction",
            "link": "detail",
            "order": 1
        },
        {
            "label": "List of product in subconstruction",
            "link": "product-subcont",
            "order": 1
        },
    ], [])


    const contents = useMemo(() => [
        {
            description: '',
            component: <SectionDetailDeliveryNoteSubcont
                code={detailDeliveryNoteSubcont.code}
                date={detailDeliveryNoteSubcont.date}
                supplierName={supplier.name}
                note={detailDeliveryNoteSubcont.note}
                driverName={driver.name}
                vehicleNumber={vehicle.license_part_number}
            />
        },
        {
            description: '',
            component: <SectionProductDeliverySubcont
                productSubcontList={productSubcontList}
            />
        }
    ], [detailDeliveryNoteSubcont, vehicle, driver, supplier, productSubcontList])


    return (
        <>
            <BaseContent
                links={links}
                breadcrumb={breadcrumb}
                contents={contents}
            />
        </>
    )
}

export default DetailDeliveryNoteSubcont

