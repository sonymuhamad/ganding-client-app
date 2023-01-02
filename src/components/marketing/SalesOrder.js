import React, { useMemo } from "react";

import { BaseContent } from "../layout";

import { SalesOrderList } from "./sales_order_components";

export default function SalesOrder() {

    const breadcrumb = useMemo(() => [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/sales-order',
            label: 'Sales Order'
        }
    ], [])


    const links = useMemo(() => [
        {
            "label": "Sales order",
            "link": "sales-order",
            "order": 1
        },
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <SalesOrderList />
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

