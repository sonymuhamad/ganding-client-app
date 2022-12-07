import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useRequest, useSection } from "../../../hooks";
import { BaseAside } from "../../layout";
import { BaseTable } from "../../tables";
import BreadCrumb from "../../BreadCrumb";
import { TextInput, Title, Divider, Group, Textarea, Badge, Paper, Image } from "@mantine/core";
import { IconCalendar, IconClipboardList, IconCodeAsterix, IconUserCheck } from "@tabler/icons";


const DetailMaterialReceiptNote = () => {

    const { materialReceiptId } = useParams()
    const { Retrieve, Loading } = useRequest()
    const { sectionRefs, activeSection, classes } = useSection()
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
            path: `/home/purchasing/shipments-and-receipts/material/${materialReceiptId}`,
            label: 'Detail material receipt note'
        }
    ], [])


    const links = useMemo(() => [
        {
            "label": "Detail material receipt note",
            "link": "#detail",
            "order": 1
        },
        {
            "label": "List of material received",
            "link": "#materials",
            "order": 1
        },

    ], [])

    const [detailReceiptNote, setDetailReceiptNote] = useState({
        id: '',
        code: '',
        note: '',
        image: '',
        date: '',
        last_update: '',
        created: ''
    })
    const [supplier, setSupplier] = useState({
        id: '',
        name: '',
        address: '',
        email: '',
        phone: ''
    })
    const [materialReceivedList, setMaterialReceivedList] = useState([])

    const columnMaterialReceived = useMemo(() => [
        {
            name: 'Material name',
            selector: row => row.material_order.material.name,
            sortable: true
        },
        {
            name: 'Material specifications',
            selector: row => row.material_order.material.spec
        },
        {
            name: 'Quantity received',
            selector: row => `${row.quantity} ${row.material_order.material.uom.name} `
        },
        {
            name: 'Receipt status',
            selector: row => <Badge color={row.schedules ? detailReceiptNote.date > row.schedules.date ? 'red.6' : 'blue.6' : 'blue.6'} variant='filled' >{row.schedules ? detailReceiptNote.date > row.schedules.date ? 'Late' : 'On time' : 'Not on schedule'}</Badge>
        }
    ], [])

    useEffect(() => {

        Retrieve(materialReceiptId, 'delivery-note-material').then(data => {
            const { supplier, materialreceipt_set, ...rest } = data
            setDetailReceiptNote(rest)
            setSupplier(supplier)
            setMaterialReceivedList(materialreceipt_set)
        })

    }, [])



    return (
        <>

            <BaseAside links={links} activeSection={activeSection} />
            <BreadCrumb links={breadcrumb} />

            <Loading />

            <section id='detail' className={classes.section} ref={sectionRefs[0]} >
                <Title className={classes.title} >
                    <a href="#detail" className={classes.a_href} >
                        Detail material receipt notes
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <TextInput
                    label='Supplier'
                    readOnly
                    variant='filled'
                    m='xs'
                    radius='md'
                    icon={<IconUserCheck />}
                    value={supplier.name}
                />

                <TextInput
                    label='Receipt number'
                    readOnly
                    variant='filled'
                    m='xs'
                    radius='md'
                    icon={<IconCodeAsterix />}
                    value={detailReceiptNote.code}
                />

                <TextInput
                    label='Receipt date'
                    readOnly
                    variant='filled'
                    m='xs'
                    radius='md'
                    icon={<IconCalendar />}
                    value={new Date(detailReceiptNote.date).toDateString()}
                />

                <Textarea
                    label='Receipt descriptions'
                    readOnly
                    variant='filled'
                    m='xs'
                    radius='md'
                    icon={<IconClipboardList />}
                    value={detailReceiptNote.note}
                />


                <Group my='lg' >
                    <Paper>
                        <Image
                            radius='md'
                            src={detailReceiptNote.image}
                            alt='material receipt note image'
                            withPlaceholder
                        />
                    </Paper>
                </Group>


            </section>

            <section id='materials' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#materials" className={classes.a_href} >
                        Detail material receipt notes
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <BaseTable
                    column={columnMaterialReceived}
                    data={materialReceivedList}
                    noData='There is no material received'
                />

            </section>

        </>
    )
}

export default DetailMaterialReceiptNote

