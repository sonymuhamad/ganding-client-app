import React, { useMemo } from "react"
import { DeliveryNote, DeliveryNoteSubcont, DeliverySchedule, Driver, Vehicle } from "./delivery_components";

import { BaseContent } from "../layout"


export default function Delivery() {

    const links = useMemo(() => [
        {
            "label": 'Delivery schedule',
            "link": 'delivery-schedule',
            'order': 1
        },
        {
            "label": "Delivery finished goods",
            "link": "delivery-note",
            "order": 1
        },
        {
            "label": 'Delivery product subconstruction',
            "link": 'dn-subcont',
            'order': 1
        },
        {
            "label": 'Driver',
            "link": 'driver',
            'order': 1
        },
        {
            "label": 'Vehicle',
            "link": 'vehicle',
            'order': 1
        },
    ], [])

    const breadcrumb = useMemo(() => [
        {
            path: '/home/ppic',
            label: 'Ppic'
        },
        {
            path: '/home/ppic/delivery',
            label: 'Delivery'
        }
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <DeliverySchedule />,
        },
        {
            description: '',
            component: <DeliveryNote />,
        },
        {
            description: '',
            component: <DeliveryNoteSubcont />,
        },
        {
            description: '',
            component: <Driver />,
        },
        {
            description: '',
            component: <Vehicle />
        }
    ], [])


    return (
        <BaseContent links={links} breadcrumb={breadcrumb} contents={contents} />
    )
}
