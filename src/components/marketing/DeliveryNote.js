import React, { useMemo } from "react";

import { BaseContent } from "../layout";
import { DeliveryNoteList } from './deliver_note_components'

export default function DeliveryNote() {


    const breadcrumb = [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/delivery-note',
            label: 'Delivery note'
        }
    ]


    const links = useMemo(() => [
        {
            "label": "Delivery notes",
            "link": "delivery-notes",
            "order": 1
        },
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <DeliveryNoteList />
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


