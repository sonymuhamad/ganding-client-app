import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useRequest } from "../../../hooks";
import { BaseContent } from "../../layout";
import { SectionDetailSubcontReceiptNote, SectionProductSubcontReceipt } from "./detail_subcont_receipt_note_components";


const DetailSubcontReceiptNote = () => {


    const { receiptSubcontId } = useParams()
    const { Retrieve } = useRequest()


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



    useEffect(() => {

        Retrieve(receiptSubcontId, 'receipts/subcont').then(data => {
            const { supplier, subcontreceipt_set, ...rest } = data
            setSupplier(supplier)
            setProductSubcontList(subcontreceipt_set)
            setDetailReceiptSubcont(rest)
        })

    }, [receiptSubcontId])

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
    ], [receiptSubcontId])


    const links = useMemo(() => [
        {
            "label": "Detail product subconstruction receipt note",
            "link": "detail",
            "order": 1
        },
        {
            "label": "List of product received",
            "link": "products",
            "order": 1
        },

    ], [])


    const contents = useMemo(() => [
        {
            description: '',
            component: <SectionDetailSubcontReceiptNote
                supplierName={supplier.name}
                code={detailReceiptSubcont.code}
                date={detailReceiptSubcont.date}
                note={detailReceiptSubcont.note}
                image={detailReceiptSubcont.image}
            />
        },
        {
            description: '',
            component: <SectionProductSubcontReceipt
                productSubcontList={productSubcontList}
                actualDate={detailReceiptSubcont.date}
            />
        }

    ], [detailReceiptSubcont, productSubcontList, supplier])

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

export default DetailSubcontReceiptNote
