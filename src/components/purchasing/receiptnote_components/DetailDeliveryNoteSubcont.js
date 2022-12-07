import React, { useEffect, useState, useMemo } from "react"

import { useParams } from "react-router-dom"
import { useRequest, useSection } from "../../../hooks"
import { BaseAside } from "../../layout"
import { BaseTable } from "../../tables"
import BreadCrumb from "../../BreadCrumb"
import { TextInput, Group, Textarea, Title, Divider } from "@mantine/core"
import { IconCalendar, IconClipboardList, IconCodeAsterix, IconTruck, IconUser, IconUserCheck } from "@tabler/icons"


const DetailDeliveryNoteSubcont = () => {

    const { Retrieve, Loading } = useRequest()
    const { deliverySubcontId } = useParams()
    const { classes, sectionRefs, activeSection } = useSection()

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
    ], [])


    const links = useMemo(() => [
        {
            "label": "Detail delivery subconstruction",
            "link": "#detail",
            "order": 1
        },
        {
            "label": "List of product in subconstruction",
            "link": "#product-subcont",
            "order": 1
        },
    ], [])

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

    const columnProductSubcont = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.product.name,
            sortable: true
        },
        {
            name: 'Product number',
            selector: row => row.product.code
        },
        {
            name: 'Process name',
            selector: row => row.process.process_name
        },
        {
            name: 'Wip',
            selector: row => `Wip ${row.process.order}`
        },
        {
            name: 'Quantity sent',
            selector: row => `${row.quantity} Pcs`
        }
    ], [])


    useEffect(() => {

        Retrieve(deliverySubcontId, 'delivery-note-subcont').then(data => {

            const { supplier, driver, vehicle, productdeliversubcont_set, ...rest } = data

            setSupplier(supplier)
            setDriver(driver)
            setVehicle(vehicle)
            setProductSubcontList(productdeliversubcont_set)
            setDetailDeliveryNoteSubcont(rest)

        })

    }, [])



    return (
        <>
            <Loading />


            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            <section id='detail' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#detail" className={classes.a_href} >
                        Detail delivery subconstruction
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <TextInput
                    readOnly
                    variant='filled'
                    label='Supplier'
                    m='xs'
                    radius='md'
                    icon={<IconUserCheck />}
                    value={supplier.name}
                />

                <TextInput
                    label='Delivery number'
                    variant='filled'
                    m='xs'
                    radius='md'
                    readOnly
                    icon={<IconCodeAsterix />}
                    value={detailDeliveryNoteSubcont.code}
                />

                <Group m='xs' grow >


                    <TextInput
                        label='Delivery date'
                        readOnly
                        variant="filled"
                        radius='md'
                        icon={<IconCalendar />}
                        value={new Date(detailDeliveryNoteSubcont.date).toDateString()}
                    />

                    <TextInput
                        label='Driver name'
                        readOnly
                        variant='filled'
                        radius='md'
                        icon={<IconUser />}
                        value={driver.name}
                    />

                    <TextInput
                        label='Vehicle number'
                        readOnly
                        variant='filled'
                        radius='md'
                        icon={<IconTruck />}
                        value={vehicle.license_part_number}
                    />

                </Group>

                <Textarea
                    label='Delivery descriptions'
                    readOnly
                    variant='filled'
                    radius='md'
                    m='xs'
                    icon={<IconClipboardList />}
                    value={detailDeliveryNoteSubcont.note}
                />

            </section>

            <section id='product-subcont' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#product-subcont" className={classes.a_href} >
                        List of product in subconstruction
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <BaseTable
                    column={columnProductSubcont}
                    data={productSubcontList}
                    noData="This delivery note doesn't have products sent "
                />

            </section>
        </>
    )
}

export default DetailDeliveryNoteSubcont

