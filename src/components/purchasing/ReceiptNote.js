import React, { useMemo } from "react";
import { SubcontReceiptNoteList, MaterialReceiptNoteList, DeliveryNoteSubcontList } from './receiptnote_components'
import { BaseContent } from "../layout";



const ReceiptNote = () => {

    const breadcrumb = useMemo(() => [
        {
            path: '/home/purchasing',
            label: 'Purchasing'
        },
        {
            path: '/home/purchasing/shipments-and-receipts',
            label: 'Shipments and receipts'
        }
    ], [])


    const links = useMemo(() => [
        {
            "label": "Material receipt notes",
            "link": "material-receipt-note",
            "order": 1
        },
        {
            "label": "Product subcontstruction delivery notes",
            "link": "delivery-note-subcont",
            "order": 1
        },
        {
            "label": "Product subcontstruction receipt notes",
            "link": "receipt-note-subcont",
            "order": 1
        },

    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <MaterialReceiptNoteList />
        },
        {
            description: '',
            component: <DeliveryNoteSubcontList />
        },
        {
            description: '',
            component: <SubcontReceiptNoteList />
        }
    ], [])


    return (
        <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />
    )
}

export default ReceiptNote
