import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useRequest, useSection } from "../../../hooks";
import { BaseAside } from "../../layout";
import { BaseTable } from "../../tables";
import BreadCrumb from "../../BreadCrumb";
import { TextInput, Title, Divider, Group, Textarea, Badge, Paper, Image } from "@mantine/core";
import { IconCalendar, IconClipboardList, IconCodeAsterix, IconUserCheck } from "@tabler/icons";


const DetailSubcontReceiptNote = () => {


    const { receiptSubcontId } = useParams()
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
            path: `/home/purchasing/shipments-and-receipts/receipt-subcont/${receiptSubcontId}`,
            label: 'Detail receipt note'
        }
    ], [])


    const links = useMemo(() => [
        {
            "label": "Detail product subconstruction receipt note",
            "link": "#detail",
            "order": 1
        },
        {
            "label": "List of product received",
            "link": "#products",
            "order": 1
        },

    ], [])

    const [productSubcontList, setProductSubcontList] = useState([])
    const [supplier, setSupplier] = useState({
        id: '',
        name: '',
        address: '',
        phone: '',
        email: ''
    })
    const [detailReceiptSubcont, setDetailReceiptSubcont] = useState({
        id: '',
        code: '',
        created: '',
        date: '',
        note: '',
        last_update: '',
        image: '',
    })


    const columnProductSubcontReceived = useMemo(() => [
        {
            name: 'Product name',
            selector: row => row.product_subcont.product.name,
            sortable: true
        },
        {
            name: 'Product number',
            selector: row => row.product_subcont.product.code,
        },
        {
            name: 'Quantity / Not good',
            selector: row => `${row.quantity} / ${row.quantity_not_good} `
        },
        {
            name: 'Receipt status',
            selector: row => row.schedules ? detailReceiptSubcont.date > row.schedules.date ? <Badge color='red.6' >Late</Badge> : <Badge color='blue.6' >On time</Badge> : <Badge color='blue.6' > Not on schedule </Badge>
        }
    ], [])

    useEffect(() => {

        Retrieve(receiptSubcontId, 'receipt-note-subcont').then(data => {
            const { supplier, subcontreceipt_set, ...rest } = data
            setSupplier(supplier)
            setProductSubcontList(subcontreceipt_set)
            setDetailReceiptSubcont(rest)
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
                        Product subconstruction receipt note
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
                    value={detailReceiptSubcont.code}
                />

                <TextInput
                    label='Receipt date'
                    readOnly
                    variant='filled'
                    m='xs'
                    radius='md'
                    icon={<IconCalendar />}
                    value={new Date(detailReceiptSubcont.date).toDateString()}
                />

                <Textarea
                    label='Receipt descriptions'
                    readOnly
                    variant='filled'
                    m='xs'
                    radius='md'
                    icon={<IconClipboardList />}
                    value={detailReceiptSubcont.note}
                />



                <Group my='lg' >
                    <Paper>
                        <Image
                            radius='md'
                            src={detailReceiptSubcont.image}
                            alt='product subconstruction image'
                            withPlaceholder
                        />
                    </Paper>
                </Group>



            </section>

            <section id='products' className={classes.section} ref={sectionRefs[1]} >
                <Title className={classes.title} >
                    <a href="#products" className={classes.a_href} >
                        List of product received
                    </a>
                </Title>

                <Divider my='md'></Divider>

                <BaseTable
                    column={columnProductSubcontReceived}
                    data={productSubcontList}
                    noData='No product received'
                />

            </section>

        </>
    )
}

export default DetailSubcontReceiptNote
