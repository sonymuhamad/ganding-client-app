import React, { useState, useMemo } from "react";

import { RawMaterial, FinishGood, Wip, ConversionUom, BaseConversionMaterial, ConvertMaterial, MaterialReceipt, ReceiptSchedule, ReceiptNoteProductSubconstruction, ReceiptSubcontSchedule } from './warehouse_components'

import { BaseContent } from "../layout";

export default function Warehouse() {

    const [actionConvertMaterial, setActionConvertMaterial] = useState(0)

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
            "label": 'Conversion unit of material ',
            "link": 'conversion-uom',
            'order': 2
        },
        {
            "label": 'Base conversion material',
            "link": 'base-conversion-material',
            'order': 2
        },
        {
            "label": 'Converted materials',
            "link": 'converted-materials',
            'order': 2
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
            description: 'This section contains information about stock of material based on its unit of material, and also access to edit stock',
            component: <RawMaterial actions={actionConvertMaterial} />
        },
        {
            description: '',
            component: <ConversionUom />
        },
        {
            description: 'This section contains data of conversion material that used as the basis to convert material in <a href="#converted-materials"  >Converted material </a>section',
            component: <BaseConversionMaterial />
        },
        {
            description: 'Reports of process transforming raw materials into another material',
            component: <ConvertMaterial actions={actionConvertMaterial} setaction={setActionConvertMaterial} />
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

