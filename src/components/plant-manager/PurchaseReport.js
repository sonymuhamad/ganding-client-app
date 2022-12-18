import React, { useMemo } from "react";
import { BaseContent } from "../layout";

import { SupplierList, PercentageMaterialReceiptSchedule, PurchaseOrderChart, MaterialOrderList, MaterialReceiptList } from './purchase_report_components'


export default function PurchaseReport() {

    const breadcrumb = useMemo(() => [
        {
            path: '/home/plant-manager',
            label: 'Manager'
        },
        {
            path: '/home/plant-manager/purchase-report',
            label: 'Purchase report'
        }
    ], [])

    const links = useMemo(() => [
        {
            "label": 'Purchase order charts',
            "link": 'purchase-order-charts',
            'order': 1
        },
        {
            "label": "Upcoming materials",
            "link": "upcoming-materials",
            "order": 1
        },
        {
            "label": "List of material received",
            "link": "material-receipt-list",
            "order": 1
        },
        {
            "label": "Supplier report",
            "link": "supplier-report",
            "order": 1
        },
        {
            "label": "Percentage of timely receipt of material",
            "link": "timely-receipt-percentage",
            "order": 1
        },
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <PurchaseOrderChart />
        },
        {
            description: '',
            component: <MaterialOrderList />
        },
        {
            description: '',
            component: <MaterialReceiptList />
        },
        {
            description: '',
            component: <SupplierList />
        },
        {
            description: '',
            component: <PercentageMaterialReceiptSchedule />
        }
    ], [])

    return (
        <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />
    )
}

