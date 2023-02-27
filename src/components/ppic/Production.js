import React, { useMemo } from "react"
import { Machine, Operator, ProductSubconstruction, ProductionPriority, ProductionReport, } from './production_components'
import { BaseContent } from "../layout";

export default function Production() {


    const links = useMemo(() => [
        {
            "label": 'Production priority',
            "link": 'production-priority',
            'order': 1
        },
        {
            "label": "Production report",
            "link": "report",
            "order": 1
        },
        {
            "label": "Product in subconstruction",
            "link": "product-subconstruction",
            "order": 1
        },
        {
            "label": 'Machine',
            "link": 'machine',
            'order': 1
        },
        {
            "label": 'Operator',
            "link": 'operator',
            'order': 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/production',
            label: 'Production'
        }
    ], [])

    const contents = useMemo(() => [
        {
            description: 'this section contains information about which products are prioritized for production, based on product orders',
            component: <ProductionPriority />
        },
        {
            description: '',
            component: <ProductionReport />
        },
        {
            description: '',
            component: <ProductSubconstruction />
        },
        {
            description: '',
            component: <Machine />
        },
        {
            description: '',
            component: <Operator />
        }
    ], [])


    return (
        <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />
    )
}
