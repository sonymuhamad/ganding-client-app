import React, { useMemo } from "react";

import { RawMaterial, FinishGood, Wip, MaterialReceipt, ReceiptSchedule, ReceiptNoteProductSubconstruction, ReceiptSubcontSchedule } from './warehouse_components'

import { BaseContent } from "../layout";

export default function Warehouse() {


    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/warehouse',
            label: 'Warehouse'
        }
    ], [])

    const links = useMemo(() => [
        {
            "label": "Raw materials",
            "link": "material-wh",
            "order": 1
        },
        {
            label: 'Finished goods',
            link: "product-wh",
            order: 1
        },
        {
            label: 'Product work in process',
            link: "wip-wh",
            order: 2
        },
        {
            label: 'Material receipt note',
            link: 'material-receipt',
            order: 1
        },
        {
            label: 'Material receipt schedule',
            link: 'receipt-schedule',
            order: 1
        },
        {
            label: 'Product subconstruction receipt note',
            link: 'receipt-note-subcont',
            order: 1
        },
        {
            label: 'Product subconstruction receipt schedule',
            link: 'subcont-receipt-schedule',
            order: 1
        },
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <RawMaterial />
        },
        {
            description: 'This section contains finished good stock of each product',
            component: <FinishGood />
        },
        {
            description: '',
            component: <Wip />
        },
        {
            description: '',
            component: <MaterialReceipt />
        },
        {
            description: '',
            component: <ReceiptSchedule />
        },
        {
            description: '',
            component: <ReceiptNoteProductSubconstruction />
        },
        {
            description: '',
            component: <ReceiptSubcontSchedule />
        }
    ], [])

    return (
        <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />
    )

}

