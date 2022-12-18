import React, { useMemo } from "react";
import { BaseContent } from '../layout'
import { ProductionChart, ProductOrderList, MaterialOrderList } from "./dashboard";


export default function PpicDashboard() {

    const links = useMemo(() => [
        {
            "label": 'Production chart',
            "link": 'production-chart',
            'order': 1
        },
        {
            "label": "List of product order",
            "link": "product-order",
            "order": 1
        },
        {
            "label": 'Upcoming materials',
            "link": 'upcoming-materials',
            'order': 1
        },
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <ProductionChart />
        },
        {
            description: '',
            component: <ProductOrderList />
        },
        {
            description: '',
            component: <MaterialOrderList />
        }
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        }
    ], [])

    return (
        <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />
    )
}


