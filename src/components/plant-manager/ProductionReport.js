import React, { useMemo } from "react";
import { ProductionChart, OperatorList, MachineList } from "./production_report_components";

import { BaseContent } from '../layout'

export default function ProductionReport() {


    const breadcrumb = useMemo(() => [
        {
            path: '/home/plant-manager',
            label: 'Manager'
        },
        {
            path: '/home/plant-manager/production-report',
            label: 'Production report'
        }
    ], [])

    const links = useMemo(() => [
        {
            "label": 'Production charts',
            "link": 'production-charts',
            'order': 1
        },
        {
            "label": "Operator performance report",
            "link": "operator-report",
            "order": 1
        },
        {
            "label": "Machine report",
            "link": "machine-report",
            "order": 1
        },
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <ProductionChart />
        },
        {
            description: '',
            component: <OperatorList />
        },
        {
            description: '',
            component: <MachineList />
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