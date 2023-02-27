import React, { useMemo } from "react";
import { PurchaseOrderList } from "./purchaseorders";
import { BaseContent } from "../layout";

export default function PurchaseOrder() {

    const links = useMemo(() => [
        {
            "label": 'List of purchase order',
            "link": 'purchase-order',
            'order': 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/purchasing',
            label: 'Purchasing'
        },
        {
            path: '/home/purchasing/purchase-order',
            label: 'Purchase order'
        }
    ], [])


    const contents = useMemo(() => [
        {
            description: '',
            component: <PurchaseOrderList />
        }
    ], [])

    return (
        <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />
    )
}
