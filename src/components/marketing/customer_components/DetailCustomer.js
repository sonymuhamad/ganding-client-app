import React, { useMemo } from "react";

import { PendingInvoice, ProductDeliverList, ProductList, ComponentDetailCustomer } from './detail_customer_components'
import { BaseContent } from '../../layout'
import { useParams } from "react-router-dom";

const DetailCustomer = () => {

    const { customerId } = useParams()

    const breadcrumb = useMemo(() => [
        {
            path: '/home/marketing',
            label: 'Marketing'
        },
        {
            path: '/home/marketing/customers',
            label: 'Customer'
        },
        {
            path: `/home/marketing/customers/${customerId}`,
            label: 'Detail customer'
        },
    ], [])


    const links = useMemo(() => [
        {
            "label": "Detail customer",
            "link": "detail",
            "order": 1
        },
        {
            "label": "Product list",
            "link": "product",
            "order": 1
        },
        {
            "label": "Pending invoice",
            "link": "pending-invoice",
            "order": 1
        },
        {
            "label": "Report delivery",
            "link": "report-delivery",
            "order": 1
        },
    ], [])

    const contents = useMemo(() => [
        {
            description: '',
            component: <ComponentDetailCustomer />
        },
        {
            description: '',
            component: <ProductList />
        },
        {
            description: '',
            component: <PendingInvoice />
        },
        {
            description: '',
            component: <ProductDeliverList />
        }
    ], [])


    return (
        <BaseContent
            breadcrumb={breadcrumb}
            links={links}
            contents={contents}
        />
    )
}

export default DetailCustomer

