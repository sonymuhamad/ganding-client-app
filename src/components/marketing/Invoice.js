import React, { useMemo } from "react";

import { InvoiceList } from "./invoice_components";

import { BaseContent } from '../layout'


const Invoice = () => {


    const breadcrumb = useMemo(() => [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/invoice',
            label: 'Invoice'
        }
    ], [])


    const links = useMemo(() => [
        {
            "label": "Invoice",
            "link": "invoice-list",
            "order": 1
        },
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <InvoiceList />
        }
    ], [])

    return (
        <BaseContent
            contents={contents}
            links={links}
            breadcrumb={breadcrumb}
        />
    )
}

export default Invoice
