import React, { useMemo } from "react";

import { BaseContent } from "../layout";
import { MaterialChart, MaterialReceived, MaterialRequest } from './dashboard_components'


export default function PurchasingDashboard() {

    const breadcrumb = useMemo(() => [
        {
            path: '/home/purchasing',
            label: 'Purchasing'
        }
    ], [])


    const links = useMemo(() => [
        {
            "label": "Request material",
            "link": "request-material",
            "order": 1
        },
        {
            "label": "Charts of material usage and orders",
            "link": "material-chart",
            "order": 1
        },
        {
            "label": "Material received",
            "link": "material-receipt",
            "order": 1
        }
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <MaterialRequest />
        },
        {
            description: '',
            component: <MaterialChart />
        },
        {
            description: '',
            component: <MaterialReceived />
        }

    ], [])


    return (
        <BaseContent links={links} contents={contents} breadcrumb={breadcrumb} />
    )
}
