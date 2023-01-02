import React, { useMemo } from "react";
import { BaseContent } from "../layout";

import { CustomerList, ProductDeliveryList, ProductOrderList, SalesOrderChart } from './sales_report_components'


export default function SalesReport() {


    const links = useMemo(() => [
        {
            "label": 'Product order charts',
            "link": 'product-order-charts',
            'order': 1
        },
        {
            "label": "Order in progress",
            "link": "order-in-progress",
            "order": 1
        },
        {
            "label": "List of delivery product",
            "link": "delivery-list",
            "order": 1
        },
        {
            "label": "Customer report",
            "link": "customer-report",
            "order": 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/plant-manager',
            label: 'Manager'
        },
        {
            path: '/home/plant-manager/sales-report',
            label: 'Sales report'
        }
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <SalesOrderChart />,
        },
        {
            description: '',
            component: <ProductOrderList />,
        },
        {
            description: '',
            component: <ProductDeliveryList />,
        },
        {
            description: '',
            component: <CustomerList />,
        }
    ], [])

    return <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />
}

