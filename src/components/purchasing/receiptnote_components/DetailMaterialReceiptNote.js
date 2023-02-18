import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useRequest } from "../../../hooks";
import { BaseContent } from "../../layout"
import { SectionDetailReceiptNote, SectionMaterialReceiptList } from "./detail_material_receipt_note_components";

const DetailMaterialReceiptNote = () => {

    const { materialReceiptId } = useParams()
    const { Retrieve } = useRequest()

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

    useEffect(() => {

        Retrieve(materialReceiptId, 'delivery-note-material').then(data => {
            const { supplier, materialreceipt_set, ...rest } = data
            setDetailReceiptNote(rest)
            setSupplier(supplier)
            setMaterialReceivedList(materialreceipt_set)
        })

    }, [materialReceiptId])


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
    ], [materialReceiptId])


    const links = useMemo(() => [
        {
            "label": "Detail material receipt note",
            "link": "detail",
            "order": 1
        },
        {
            "label": "List of material received",
            "link": "materials",
            "order": 1
        },

    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <SectionDetailReceiptNote
                supplierName={supplier.name}
                note={detailReceiptNote.note}
                date={detailReceiptNote.date}
                code={detailReceiptNote.code}
                image={detailReceiptNote.image}
            />
        },
        {
            description: '',
            component: <SectionMaterialReceiptList
                materialReceivedList={materialReceivedList}
                actualDate={detailReceiptNote.date}
            />
        }

    ], [detailReceiptNote, materialReceivedList, supplier])

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

export default DetailMaterialReceiptNote

