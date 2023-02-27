import React, { useMemo } from 'react'

import { ReceiptNoteList, DeliveryNoteList, PercentageDeliveryTimeLiness, PercentageMaterialReceiptSchedule, ProductionList } from './manager_dashboard_components'

import { BaseContent } from '../layout'

const ManagerDashboard = () => {


    const breadcrumb = useMemo(() => [
        {
            path: '/home/plant-manager',
            label: 'Manager'
        },
    ], [])

    const links = useMemo(() => [
        {
            "label": 'Deliveries timeliness rate',
            "link": 'deliveries-rate',
            'order': 1
        },
        {
            "label": "Receipts timeliness rate",
            "link": "receipts-rate",
            "order": 1
        },
        {
            "label": "Production this week",
            "link": "production",
            "order": 1
        },
        {
            "label": "Deliveries this week",
            "link": "deliveries",
            "order": 1
        },
        {
            "label": "Receipts this week",
            "link": "receipts",
            "order": 1
        },
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <PercentageDeliveryTimeLiness />
        },
        {
            description: '',
            component: <PercentageMaterialReceiptSchedule />
        },
        {
            description: '',
            component: <ProductionList />
        },
        {
            description: '',
            component: <DeliveryNoteList />
        },
        {
            description: '',
            component: <ReceiptNoteList />
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


export default ManagerDashboard


