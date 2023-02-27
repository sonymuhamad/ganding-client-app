import React, { useMemo } from "react";


import { ProductOrderChart, ProductOrderList, DeliveryScheduleList, FinishedSalesOrderList } from "./dashboard_components";
import { BaseContent } from "../layout";

export default function MarketingDashboard() {

    const breadcrumb = useMemo(() => [
        {
            path: '/home/marketing',
            label: 'Marketing'
        }
    ], [])



    const links = useMemo(() => [
        {
            "label": "Product order charts",
            "link": "product-order-charts",
            "order": 1
        },
        {
            "label": "Finished sales order",
            "link": "finished-sales-order",
            "order": 1
        },
        {
            "label": "Order in progress",
            "link": "product-order",
            "order": 1
        },
        {
            "label": "Delivery schedules",
            "link": "delivery-schedule",
            "order": 1
        },

    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <ProductOrderChart />
        },
        {
            description: '',
            component: <FinishedSalesOrderList />
        },
        {
            description: '',
            component: <ProductOrderList />
        },
        {
            description: '',
            component: <DeliveryScheduleList />
        }
    ], [])


    return (
        <BaseContent
            links={links}
            breadcrumb={breadcrumb}
            contents={contents}
        />
    )

}


